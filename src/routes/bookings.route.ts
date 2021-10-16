import { Router } from 'express';
import BookingController from '@controllers/bookings.controller';
import { protect } from '@middlwares/auth.middleware';

class BookingRoute {
  public path = '/bookings';
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/checkout-session/:tourId`, protect, this.bookingController.getCheckoutSession);
  }
}

export { BookingRoute };
