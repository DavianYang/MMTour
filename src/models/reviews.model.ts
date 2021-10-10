import { Schema, Types, model, Model } from 'mongoose';
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (this: Model<ReviewDocument>, tourId: string) {
  const stats = await this.aggregate([{ $match: { tour: tourId } }]);
};

const reviewModel = model<ReviewDocument>('Review', reviewSchema);

export { reviewModel };
