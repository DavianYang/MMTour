import { NextFunction, Response, Request } from 'express';
import AppError from '@/exceptions/AppError';
import { logger } from '@utils/logger';

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
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
  console.log('ERROR 🐛:', err);
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

export const errorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, req, res);
  }
};
