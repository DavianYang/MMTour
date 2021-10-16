import { NextFunction, Request, Response } from 'express';
import { BookingService } from '@services/bookings.service';
import { TourService } from '@services/tours.service';
import catchAsync from '@utils/catchAsync';

class BookingController {
  private bookingService = new BookingService();
  private tourService = new TourService();

  public getCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await this.tourService.findTour(req.params.tourId);

    const session = await this.bookingService.createCheckoutSession(req.protocol, req.get('host'), req.user.email, req.params.tourId, tour);

    res.status(200).json({
      status: 'success',
      session,
    });
  });
}

export default BookingController;
