import { Schema, Types, model, Query } from 'mongoose';
import { BookingDocument, BookingPopulatedDocument } from '@interfaces/bookings.interface';

const bookingSchema = new Schema<BookingDocument>({
  tour: {
    type: Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour'],
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre<Query<BookingPopulatedDocument, BookingPopulatedDocument>>(/^find/, function (this, next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

const bookingModel = model<BookingDocument>('Booking', bookingSchema);

export { bookingModel };
