import { NextFunction, Request, Response } from 'express';
import catchAsync from '@utils/catchAsync';

class IndexController {
  public index = catchAsync((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
  });
}

export default IndexController;
