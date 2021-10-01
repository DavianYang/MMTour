import { STATUS_CODES } from 'http';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import { errorConverter, errorHandler } from '@middlwares/error.middleware';
import AppError from '@exceptions/AppError';
import { logger } from '@utils/logger';

describe('Error Middlewares', () => {
  describe('Error Converter', () => {
    const next = jest.fn();

    test('should return the same AppError object it was called with', () => {
      const error = new AppError('Error', 400);

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('should convert an Error to an AppError and preserver its status and message', () => {
      const error: any = new Error('Any Error');
      error.statusCode = 400;

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: error.message,
          isOperational: false,
        }),
      );
    });

    test('should convert an Error without message to AppError with default message of http status', () => {
      const error: any = new Error();
      error.statusCode = 400;

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: STATUS_CODES[error.statusCode],
          isOperational: false,
        }),
      );
    });

    test('should convert a Mongoose error to AppError with status 400 and preserve its message', () => {
      const error = new mongoose.Error('Any Mongoose Error');

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: error.message,
          isOperational: false,
        }),
      );
    });

    test('should convert an Error without status to AppError with status 500', () => {
      const error: any = {};

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: STATUS_CODES[500],
          isOperational: false,
        }),
      );
    });
  });

  describe('Error Handler', () => {
    beforeEach(() => {
      jest.spyOn(logger, 'error').mockImplementation();
    });

    const res = httpMocks.createResponse();
    const req = httpMocks.createRequest();
    const jsonSpy = jest.spyOn(res, 'json');

    test('should send proper error response, stack and put the error message in res.locals in test', () => {
      const error = new AppError('Any Error', 400);

      errorHandler(error, req, res);

      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Something went wrong',
          message: error.message,
        }),
      );
      expect(res.locals.errorMessage).toBe(error.message);
    });

    test('should put the error stack in the response if in development mode', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Any Error', 400);

      errorHandler(error, req, res);

      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Something went wrong',
          message: error.message,
          error: error,
          stack: error.stack,
        }),
      );
    });

    test('should send internal server error status, title and message if in production mode and error is not operational', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('Any Error', 400, false);

      errorHandler(error, req, res);

      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Something went wrong',
          message: 'Please try again later',
        }),
      );
      expect(res.locals.errorMessage).toBe(error.message);
    });

    test('should preserve orignal error status and messageg if in production mode and error is operational', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('Any Error', 400, false);

      errorHandler(error, req, res);

      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Something went wrong',
          message: error.message,
        }),
      );
    });
  });
});
