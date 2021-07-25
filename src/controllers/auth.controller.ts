import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@services/auth.service';
import { UserDocument } from '@interfaces/users.interface';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import { PROVIDE_EMAIL_PASSWORD, INCORRECT_EMAIL_PASSWORD } from '@resources/strings';

class AuthController {
  private authService = new AuthService();

  private sendJWTToken = (req: Request, res: Response, token: string, user: UserDocument, statusCode: number) => {
    // Save jwt token to cookie and set security and expired date
    res.cookie('jwt', token, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  };

  public signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newUser } = await this.authService.signup(req);
    this.sendJWTToken(req, res, token, newUser, 201);
  });

  public logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(PROVIDE_EMAIL_PASSWORD, 400));
    }

    const { token, user, correctPassword } = await this.authService.login(email, password);

    if (!user || !correctPassword) {
      return next(new AppError(INCORRECT_EMAIL_PASSWORD, 401));
    }

    this.sendJWTToken(req, res, token, user, 200);
  });
}

export { AuthController };
