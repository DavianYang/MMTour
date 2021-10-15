import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { upload } from '@services/image.service';

const uploadUserImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('photo');

  next();
};

const resizeUserImage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`);
};

export { uploadUserImage };
