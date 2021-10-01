class AppError extends Error {
  public statusCode: number;
  public status: string | 'fail' | 'error';
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
