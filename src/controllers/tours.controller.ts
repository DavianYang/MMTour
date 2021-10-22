import { NextFunction, Request, Response } from 'express';
import { TourService } from '@services/tours.service';
import { ItineraryService } from '@services/itineraries.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class TourController {
  private tourService = new TourService();
  private itineraryService = new ItineraryService();

  // GET
  public getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tours = await this.tourService.findAllTours(req.query);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  });

  public getTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await this.tourService.findTour(req.params.id);

    if (!tour) {
      return next(new AppError(strings.TOUR_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: tour,
      },
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

  public getMonthlyPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

  public getToursWithin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',').map(x => Number(x));

    const radius: number = unit === 'mi' ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

    if (!lat || !lng) {
      next(new AppError(strings.PROVIDE_LAT_LONG, 400));
    }

    const tours = await this.tourService.findDistanceWithin(lat, lng, radius);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  });

  public getTourDistances = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',').map(x => Number(x));

    const multiplier: number = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      next(new AppError(strings.PROVIDE_LAT_LONG, 400));
    }

    const tours = await this.tourService.findDistances(lat, lng, multiplier);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  });

  // CREATE
  public createTour = catchAsync(async (req: Request, res: Response) => {
    const createdTour = await this.tourService.createTour(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdTour,
      },
    });
  });

  // UPDATE
  public updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedTour = await this.tourService.updateTour(req.params.id, req.body);

    if (!updatedTour) {
      return next(new AppError(strings.TOUR_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedTour,
      },
    });
  });

  // DELETE
  public deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.tourService.deleteTour(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export { TourController };
