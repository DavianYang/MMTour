import AppError from '@exceptions/AppError';

export interface FileFilterCallback {
  (error: AppError | Error): void;
  (error: AppError | null, acceptFile: boolean): void;
}
