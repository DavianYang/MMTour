// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import catchAsync from '@utils/catchAsync';

const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  req.query.limit = req.params.number;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficult';
  next();
};

const resizeTourImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = [];
  req.body.images = [];

  await Promise.all(
    req.files.imageCover.map(async (file, idx) => {
      const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover-${idx + 1}.jpeg`;

      await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${imageCoverFilename}`);

      req.body.imageCover.push(imageCoverFilename);
    }),
  );

  await Promise.all(
    req.files.images.map(async (file, idx) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${idx + 1}.jpeg`;

      await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${fileName}`);

      req.body.images.push(fileName);
    }),
  );

  next();
});

export { aliasTopTours, resizeTourImages };
