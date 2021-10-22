import { Schema, model, Types, HookNextFunction, Query } from 'mongoose';
import slugify from 'slugify';
import { TourDocument } from '@interfaces/tours.interface';

const ImageLimit = function <T>(this: TourDocument, value: Array<T>): boolean {
  const imageNum = 5;
  return value.length <= imageNum;
};

const DateLimit = function <T>(this: TourDocument, value: Array<T>): boolean {
  const DateNum = 10;
  return value.length <= DateNum;
};

const tourSchema = new Schema<TourDocument>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    accommodation: String,
    covidSecure: String,
    meal: {
      name: String,
      badge: [
        {
          type: String,
          enum: {
            values: ['Jain Food', 'Vegetarian Food', 'Halal Food', 'Kosher Food'],
          },
        },
      ],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy, medium, hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less 5.0'],
      set: (val: number): number => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: TourDocument, val: Number): boolean {
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} should be below regular price',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    imageCover: [{ type: String, required: [true, 'A tour must have a cover image'] }],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      select: false,
    },
    startDates: {
      type: [
        {
          type: Date,
        },
      ],
      validate: [DateLimit, 'Start Dates exceed the limit of 10'],
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    additionalService: String,
    flights: String,
    optional: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    itineraries: [
      {
        type: Types.ObjectId,
        ref: 'Itinerary',
      },
    ],
    guides: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('duratinWeek').get(function (this: TourDocument): number {
  return this.duration / 7;
});

tourSchema.pre<TourDocument>('save', function (next: HookNextFunction) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre<Query<TourDocument, TourDocument>>(/^find/, function (next: HookNextFunction) {
  this.find({ secretTour: { $ne: true } });

  next();
});

tourSchema.pre<Query<TourDocument, TourDocument>>(/^find/, function (next: HookNextFunction) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

const tourModel = model<TourDocument>('Tour', tourSchema);

export { tourModel };
