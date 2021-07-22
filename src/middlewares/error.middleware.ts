import { NextFunction, Response, Request } from 'express';
import AppError from '@exceptions/AppError';
import { CastError, ErrorEventsInter } from '@interfaces/errors.interface';
import { logger } from '@utils/logger';

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {};

const handleMongoErrorDB = err => {
  // Duplicate Error
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate Field value: ${value}.Please use another value!`;
    return new AppError(message, 400);
  }
};

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  console.log('Dev Error', err.statusCode);
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDER WEBSITE
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err.statusCode}, Message:: ${err.message}`);
  return res.status(err.statusCode).json({
    title: 'Something went wrong',
    message: err.message,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Trusted Error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
      });
    }

    // LOG ERROR AND SEND GENERIC MESSAGE
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err.statusCode}, Message:: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // RENDER WEBISTE
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: 'Something went wrong',
      msg: 'Please try again later',
    });
  }
};

const ErrorEvents: ErrorEventsInter = {
  CastError: handleCastErrorDB,
  ValidationError: handleValidationErrorDB,
  MongoError: handleMongoErrorDB,
};

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    for (const errevent in ErrorEvents) {
      if (errevent === err.name) {
        console.log('It is True');
        err = ErrorEvents[errevent](err);
      }
    }
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // for (const errevent in ErrorEvents) {
    //   if (errevent === err.name) {
    //     console.log('It is True');
    //     err = ErrorEvents[errevent](err);
    //   }
    // }
    // sendErrorProd(error, req, res);
  }
};
