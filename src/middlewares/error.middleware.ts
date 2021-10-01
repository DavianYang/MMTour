import { STATUS_CODES } from 'http';
import { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import AppError from '@exceptions/AppError';
import { CastError, ValidationError, MongoError, ErrorEventsInter } from '@interfaces/errors.interface';
import { logger } from '@utils/logger';
import * as strings from '@resources/strings';

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: ValidationError) => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid  input data. ${error.join('. ')}.`;
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err: MongoError) => {
  // Duplicate Error
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate Field value: ${value}.Please use another value!`;
    return new AppError(message, 400);
  }
};

const handleJWTError = () => new AppError(strings.INVALID_TOKEN_LOGIN_AGAIN, 401);

const handleExpiredJWTError = () => new AppError(strings.EXPIRED_TOKEN_LOGIN_AGAIN, 401);

const ErrorEvents: ErrorEventsInter = {
  CastError: handleCastErrorDB,
  ValidationError: handleValidationErrorDB,
  MongoError: handleMongoErrorDB,
  JsonWebTokenError: handleJWTError,
  TokenExpiredError: handleExpiredJWTError,
};

export const errorConverter = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error: any = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || STATUS_CODES[statusCode];
    error = new AppError(message, statusCode, false);
  }

  next(error);
};

export const errorHandler = (err: AppError, req: Request, res: Response, next?: NextFunction) => {
  err.status = err.status || 'error';

  for (const errevent in ErrorEvents) {
    if (errevent === err.name) {
      err = ErrorEvents[errevent](err);
    }
  }

  let { statusCode, message } = err;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Please try again later';
  }

  res.locals.errorMessage = err.message;

  const response = {
    title: 'Something went wrong',
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err, stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    // Log Error in terminal
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err.statusCode}, Message:: ${err.message}`);
  }

  res.status(statusCode).json(response);
};
