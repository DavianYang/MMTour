import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/users.service';
import { UserDocument } from '@interfaces/users.interface';
import AppError from '@exceptions/AppError';
import Email from '@utils/email';
import catchAsync from '@utils/catchAsync';
import {
  YOUR_PASSWORD_RESET_TOKEN,
  PROVIDE_EMAIL_PASSWORD,
  INCORRECT_EMAIL_PASSWORD,
  TROUBLE_SENDING_EMAIL,
  USER_WITH_EMAIL_NOT_FOUND,
  INVALID_TOKEN,
  INCORRECT_CURRENT_PASSWORD,
} from '@resources/strings';

class AuthController {
  private userService = new UserService();

  public signJWTToken = (user: UserDocument) => {
    const id: string = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });

    return token;
  };

  private sendJWTToken = (req: Request, res: Response, user: UserDocument, statusCode: number) => {
    const token = this.signJWTToken(user._id);

    // Save jwt token to cookie and set security and expired date
    res.cookie('jwt', token, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    // Remove password which was from query from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  };

  public signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await this.userService.createUser(req);
    this.sendJWTToken(req, res, newUser, 201);
  });

  public logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(PROVIDE_EMAIL_PASSWORD, 400));
    }

    const user = await this.userService.findUserByEmail(email);
    const correctPassword = await user.correctPassword(password, user.password);

    if (!user || !correctPassword) {
      return next(new AppError(INCORRECT_EMAIL_PASSWORD, 401));
    }

    this.sendJWTToken(req, res, user, 200);
  });

  public logOut = (req: Request, res: Response) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  };

  public forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on POSTed email
    const user = await this.userService.findUserByEmail(req.body.email);
    if (!user) {
      return next(new AppError(USER_WITH_EMAIL_NOT_FOUND, 404));
    }

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).send('passwordReset', YOUR_PASSWORD_RESET_TOKEN);

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError(TROUBLE_SENDING_EMAIL, 500));
    }
  });

  public resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await this.userService.findUserByToken(hashedToken);

    // If token has not expired and there is user, set the new password
    if (!user) {
      return next(new AppError(INVALID_TOKEN, 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    // Update changePasswordAt property for user
    // Log the user in, send JWT
    this.sendJWTToken(req, res, user, 200);
  });

  public updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get user from collection
    const user = await this.userService.findUserById(req.user.id);

    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, req.body.password))) {
      return next(new AppError(INCORRECT_CURRENT_PASSWORD, 401));
    }

    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    this.sendJWTToken(req, res, user, 200);
  });
}

export { AuthController };
