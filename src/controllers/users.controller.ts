import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/users.service';
import AppError from '@utils/appError';
import catchAsync from '@utils/catchAsync';
import { USER_WITH_ID_NOT_FOUND, USER_ROUTE_NOT_DEFINED, USER_ROUTE_NOT_FOR_UPDATE } from '@resources/strings';

class UserController {
  private userService = new UserService();

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
  };

  public updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError(USER_ROUTE_NOT_FOR_UPDATE, 404));
    }

    const updatedUser = await this.userService.updateCurrentUser(req);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });

  public deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  public getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.findAllUsers(req);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  });

  public getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userService.findUser(req);

    if (!user) {
      return next(new AppError(USER_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: user,
      },
    });
  });

  public createUser = async (req: Request, res: Response) => {
    res.status(418).json({
      status: 'error',
      message: USER_ROUTE_NOT_DEFINED,
    });
  };

  public updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await this.userService.updateUser(req);

    if (!updatedUser) {
      return next(new AppError(USER_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedUser,
      },
    });
  });

  public deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.userService.deleteUser(req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export { UserController };
