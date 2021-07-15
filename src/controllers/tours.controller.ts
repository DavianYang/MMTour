import { NextFunction, Request, Response } from 'express';
import { TourService } from '@services/tours.service';
import AppError from '@utils/appError';
import catchAsync from '@utils/catchAsync';
import { TOUR_WITH_ID_NOT_FOUND } from '@resources/strings';

class TourController {
  private tourService = new TourService();

  public aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
    req.query.limit = req.params.number;
    req.query.sort = '-ratingAverage, price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficult';
  };

  public getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tours = await this.tourService.findAllTours(req);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  });

  public getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await this.tourService.findTour(req);

    if (!tour) {
      return next(new AppError(TOUR_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: tour,
      },
    });
  });

  public createTour = catchAsync(async (req: Request, res: Response) => {
    const createdTour = await this.tourService.createTour(req);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdTour,
      },
    });
  });

  public updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedTour = await this.tourService.updateTour(req);

    if (!updatedTour) {
      return next(new AppError(TOUR_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedTour,
      },
    });
  });

  public deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.tourService.deleteTour(req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  public getTourStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await this.tourService.findTourStats();

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  });

  public getMonthlyWeeklyPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const year = parseInt(req.params.year as string);
    let month = null;

    if (req.params.month) {
      month = parseInt(req.params.month as string);
    }
    const plan = await this.tourService.findMonthlyPlan(year, month);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  });
}

export { TourController };
