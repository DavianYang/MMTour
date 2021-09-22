import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/users.service';
import Email from '@services/email.service';
import { UserDocument } from '@interfaces/users.interface';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class AuthController {
  private userService = new UserService();

  public signJWTToken = (id: string) => {
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
    // If given email is already registered
    if (await this.userService.users.isEmailTaken(req.body.email)) {
      return next(new AppError(strings.EMAIL_ALREADY_TAKEN, 400));
    }
    const newUser = await this.userService.createUser(req.body);
    this.sendJWTToken(req, res, newUser, 201);
  });

  public logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(strings.PROVIDE_EMAIL_PASSWORD, 400));
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user || !(await user.isPasswordMatch(password, user.password))) {
      return next(new AppError(strings.INCORRECT_EMAIL_PASSWORD, 401));
    }

    this.sendJWTToken(req, res, user, 200);
  });

  public logOut = (req: Request, res: Response) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(204).json({ status: 'success' });
  };

  public forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) next(new AppError(strings.PROVIDE_EMAIL_ADDRESS, 400));

    // Get user based on POSTed email
    const user = await this.userService.findUserByEmail(req.body.email);
    if (!user) {
      return next(new AppError(strings.USER_WITH_EMAIL_NOT_FOUND, 404));
    }

    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).send('passwordReset', strings.YOUR_PASSWORD_RESET_TOKEN);

      res.status(204).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError(strings.TROUBLE_SENDING_EMAIL, 500));
    }
  });

  public resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.token) next(new AppError(strings.PROVIDE_TOKEN, 404));

    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await this.userService.findUserByToken(hashedToken);

    // If token has not expired and there is user, set the new password
    if (!user) {
      return next(new AppError(strings.INVALID_TOKEN, 400));
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
    if (!(await user.isPasswordMatch(req.body.passwordCurrent, req.body.password))) {
      return next(new AppError(strings.INCORRECT_CURRENT_PASSWORD, 401));
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
