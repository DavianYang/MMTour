import { Schema, Types, model } from 'mongoose';
import { ReviewDocument } from '@interfaces/reviews.interface';

const reviewSchema = new Schema<ReviewDocument>(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const reviewModel = model<ReviewDocument>('Review', reviewSchema);

export { reviewModel };
