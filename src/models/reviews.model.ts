import { Schema, Types, model, Model, Query } from 'mongoose';
import { tourModel } from '@models/tours.model';
import { ReviewDocument, ReviewModel, ReviewPopulatedDocument, ReviewBaseDocument } from '@interfaces/reviews.interface';

const reviewSchema = new Schema<ReviewDocument, ReviewModel>(
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
    itineraryRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: { type: Date },
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

reviewSchema.pre<Query<ReviewPopulatedDocument, ReviewPopulatedDocument>>(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (this: Model<ReviewDocument>, tourId: string) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    { $group: { _id: '$tour', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
  ]);

  await tourModel.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  });
};

reviewSchema.post<ReviewDocument>('save', function (this: ReviewDocument) {
  (this.constructor as ReviewModel).calcAverageRatings(this.tour);
});

const reviewModel = model<ReviewDocument, ReviewModel>('Review', reviewSchema);

export { reviewModel };
