import { Schema, model, Types, HookNextFunction, Query } from 'mongoose';
import slugify from 'slugify';
import { TourDocument } from '@interfaces/tours.interface';

const ObjectLimit = function <T>(this: TourDocument, value: Array<T>): boolean {
  return value.length <= 5;
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
    description: {
      type: String,
      trim: true,
      minLength: [10, 'A tour must have at least {{MINLENGTH}} words to write an description'],
      maxLength: [160, 'A tour must have at least {{MAXENGTH}} words to write an description'],
    },
    imageCover: {
      type: [
        {
          type: String,
          match: [new RegExp('(https?://.*.(?:png|jpg))'), 'Please input correct image url'],
        },
      ],
      validate: [ObjectLimit, 'Image Cover exceeds the limit of 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [
        {
          type: Date,
        },
      ],
      validate: [ObjectLimit, 'Start Dates exceeds the limit of 5'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocations: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    introduction: String,
    itinerary: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        day: Number,
        locationName: String,
        description: {
          type: String,
          minLength: [10, 'A tour must have at least {{MINLENGTH}} words to write an description'],
          maxLength: [160, 'A tour must have at least {{MAXENGTH}} words to write an description'],
        },
        images: {
          type: [
            {
              type: String,
              match: [new RegExp('(https?://.*.(?:png|jpg))'), 'Please input correct image url'],
            },
          ],
          validate: [ObjectLimit, 'Image Cover exceeds the limit of 5'],
        },
        coordinates: [Number],
        address: String,
      },
    ],
    whatisincluded: [
      {
        type: Array,
        accommodation: String,
        covidsecure: String,
        meal: String,
        additionalservice: String,
        transport: String,
        flights: String,
        insurance: String,
        Optional: String,
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

tourSchema.virtual('duratinWeek').get(function (this: TourDocument) {
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
