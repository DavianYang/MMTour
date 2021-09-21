import { NextFunction, Request, Response } from 'express';

export const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  req.query.limit = req.params.number;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficult';
  next();
};
