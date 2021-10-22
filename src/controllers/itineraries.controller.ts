import { NextFunction, Request, Response } from 'express';
import { ItineraryService } from '@services/itineraries.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class ItineraryController {
  private itineraryService = new ItineraryService();

  // GET
  public getAllItineraries = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const itineraries = await this.itineraryService.findAllItineraries(req.query);

    res.status(200).json({
      status: 'success',
      results: itineraries.length,
      data: itineraries,
    });
  });

  public getItinerary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const itinerary = await this.itineraryService.findItinerary(req.params.id);

    if (!itinerary) {
      return next(new AppError(strings.ITINERARY_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: itinerary,
      },
    });
  });

  // CREATE
  public createItinerary = catchAsync(async (req: Request, res: Response) => {
    const createdItinerary = await this.itineraryService.createItinerary(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdItinerary,
      },
    });
  });

  // UPDADTE
  public updateItinerary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedItinerary = await this.itineraryService.updateItinerary(req.params.id, req.body);

    if (!updatedItinerary) {
      return next(new AppError(strings.ITINERARY_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedItinerary,
      },
    });
  });

  // DELETE
  public deleteItinerary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.itineraryService.deleteItinerary(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export default ItineraryController;
