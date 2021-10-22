import { Document } from 'mongoose';
import { UserBaseDocument } from '@interfaces/users.interface';
import { TourBaseDocument } from '@interfaces/tours.interface';

export interface BookingBaseDocument extends Document {
  price: string;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDocument extends BookingBaseDocument {
  tour: TourBaseDocument['_id'];
  user: UserBaseDocument['_id'];
}

export interface BookingPopulatedDocument extends BookingBaseDocument {
  tour: TourBaseDocument;
  user: UserBaseDocument;
}
