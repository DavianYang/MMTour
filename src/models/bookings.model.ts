import { Schema, Types, model, Model, Query } from 'mongoose';

const bookingSchema = new Schema({
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
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (this, next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

const bookingModel = model('Booking', bookingSchema);

export { bookingModel };
