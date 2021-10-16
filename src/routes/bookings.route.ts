import { Router } from 'express';
import BookingController from '@controllers/bookings.controller';
import { protect, restrictTo } from '@middlwares/auth.middleware';

class BookingRoute {
  public path = '/bookings';
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(protect);

    this.router.get(`${this.path}/checkout-session/:tourId`, this.bookingController.getCheckoutSession);

    this.router.use(restrictTo('admin', 'lead-guide'));

    this.router.route(`${this.path}/`).get(this.bookingController.getAllBookings).post(this.bookingController.createBooking);

    this.router
      .route(`${this.path}/:id`)
      .get(this.bookingController.getBooking)
      .patch(this.bookingController.updateBooking)
      .delete(this.bookingController.deleteBooking);
  }
}

export { BookingRoute };
