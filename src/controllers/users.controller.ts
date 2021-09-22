import { NextFunction, Request, Response } from 'express';
import { UserService } from '@services/users.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class UserController {
  private userService = new UserService();

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
  };

  // GET
  public getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.findAllUsers(req.query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  });

  public getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userService.findUser(req.params.id);

    if (!user) {
      return next(new AppError(strings.USER_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: user,
      },
    });
  });

  // CREATE
  public createUser = (req: Request, res: Response) => {
    res.status(418).json({
      status: 'error',
      message: strings.USER_ROUTE_NOT_DEFINED,
    });
  };

  // UPDATE
  public updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError(strings.USER_ROUTE_NOT_FOR_UPDATE, 404));
    }

    const updatedUser = await this.userService.updateCurrentUser(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });

  public updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedUser = await this.userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      return next(new AppError(strings.USER_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedUser,
      },
    });
  });

  // DELETE
  public deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.userService.deleteCurrentUser(req.user.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  public deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.userService.deleteUser(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export { UserController };
