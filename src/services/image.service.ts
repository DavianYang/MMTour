import { Request } from 'express';
import multer from 'multer';
import AppError from '@exceptions/AppError';
import { FileFilterCallback } from '@interfaces/image.interface';

const multerStorage = multer.memoryStorage();

const multerFiler = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFiler });

export { upload };
