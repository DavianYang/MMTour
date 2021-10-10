import { Document, Types } from 'mongoose';
import { TourBaseDocument } from '@interfaces/tours.interface';
import { UserBaseDocument } from '@interfaces/users.interface';

export interface Review {
  review: string;
  rating: number;
}

export interface ReviewBaseDocument extends Review, Document {
  createdAt: Date;
}

export interface ReviewDocument extends ReviewBaseDocument {
  tour: TourBaseDocument['_id'];
  user: UserBaseDocument['_id'];
}

export interface ReviewPopulatedDocument {
  tour: TourBaseDocument;
  user: UserBaseDocument;
}
