import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '@models/users.model';
import { DataStoredInToken } from '@interfaces/auth.interface';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(strings.NOT_LOGGED_IN, 401));
  }

  const decoded = (await jwt.verify(token, process.env.JWT_SECRET)) as DataStoredInToken;

  // Check if user still exists
  const currentUser = await userModel.findById(decoded.id);

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError(strings.PASSWORD_RECENT_CHANGED, 401));
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(strings.DONT_HAVE_PERMISSION, 403));
    }
    next();
  };
};
