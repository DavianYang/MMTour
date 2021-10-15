import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import catchAsync from '@utils/catchAsync';

const resizeUserImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`);

  next();
});

export { resizeUserImage };
