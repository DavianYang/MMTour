import Stripe from 'stripe';
import { bookingModel } from '@models/bookings.model';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';
import { TourDocument } from '@interfaces/tours.interface';
import { QueryString } from '@interfaces/queries.interface';

class BookingService {
  public bookings = bookingModel;
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

  public async findAllBookings(query: object) {
    return await findAll(this.bookings, query as QueryString);
  }

  public async findBooking(id: string) {
    return await findOne(this.bookings, id);
  }

  public async createBooking(tourBody: object) {
    return await createOne(this.bookings, tourBody);
  }

  public async createCheckoutSession(protocol: string, host: string, email: string, tourId: string, tour: TourDocument) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${protocol}://${host}/`,
      cancel_url: `${protocol}://${host}/tour/${tour.slug}`,
      customer_email: email,
      client_reference_id: tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.description,
          images: [`${protocol}://${host}/img/tours/${tour.imageCover}`],
          amount: tour.price * 100,
          currency: 'usd',
          quantity: 1,
        },
      ],
    });
  }

  public async updateBooking(id: string, body: object) {
    return await updateOne(this.bookings, id, body);
  }

  public async deleteBooking(id: string) {
    return await deleteOne(this.bookings, id);
  }
}

export { BookingService };
