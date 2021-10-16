import { NextFunction, Request, Response } from 'express';
import { BookingService } from '@services/bookings.service';
import { TourService } from '@services/tours.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class BookingController {
  private bookingService = new BookingService();
  private tourService = new TourService();

  // GET
  public getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await this.bookingService.findAllBookings(req.query);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings,
    });
  });

  public getBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const booking = await this.bookingService.findBooking(req.params.id);

    if (!booking) {
      return next(new AppError(strings.BOOKING_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: booking,
      },
    });
  });

  public getCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await this.tourService.findTour(req.params.tourId);

    const session = await this.bookingService.createCheckoutSession(req.protocol, req.get('host'), req.params.tourId, req.user, tour);

    res.status(200).json({
      status: 'success',
      session,
    });
  });

  // CREATE
  public createBooking = catchAsync(async (req: Request, res: Response) => {
    const createdBooking = await this.bookingService.createBooking(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdBooking,
      },
    });
  });

  public createBookingCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();
    await this.bookingService.createBooking({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
  });

  // UPDADTE
  public updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedBooking = await this.bookingService.updateBooking(req.params.id, req.body);

    if (!updatedBooking) {
      return next(new AppError(strings.BOOKING_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedBooking,
      },
    });
  });

  // DELETE
  public deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.bookingService.deleteBooking(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export default BookingController;
