import { Document, Model, Query } from 'mongoose';
import { TourBaseDocument, TourDocument } from '@interfaces/tours.interface';
import { UserBaseDocument } from '@interfaces/users.interface';

export interface Review {
  review: string;
  rating: number;
}

export interface ReviewBaseDocument extends Review, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDocument extends ReviewBaseDocument {
  tour: TourBaseDocument['_id'];
  user: UserBaseDocument['_id'];
}

export interface ReviewPopulatedDocument extends ReviewBaseDocument {
  tour: TourBaseDocument;
  user: UserBaseDocument;
}

export interface ReviewModel extends Model<ReviewDocument> {
  calcAverageRatings(tourId: string): Promise<Query<TourDocument, TourDocument>>;
}
