import { Document, Types } from 'mongoose';

export interface ReviewDocument extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: Types.ObjectId;
  user: Types.ObjectId;
}
