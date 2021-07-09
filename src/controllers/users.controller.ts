import { NextFunction, Request, Response } from 'express';
import userService from '@services/users.service';
import AppError from '@utils/appError';
import catchAsync from '@utils/catchAsync';
import { USER_WITH_ID_NOT_FOUND, USER_ROUTE_NOT_DEFINED } from '@resources/strings';

class UsersController {
  public userService = new userService();

  public getUserAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.findAllUser();

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
        data: null,
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

export default UsersController;
