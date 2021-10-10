import { Document, Types } from 'mongoose';
import { UserDocument } from '@interfaces/users.interface';

enum Badge {
  'Jain Food',
  'Vegetarian Food',
  'Halal Food',
  'Kosher Food',
}

interface Meal {
  name: string;
  badge: Array<Badge>;
}

interface Images {
  image: string;
  placeName: string;
}

interface StartLocation {
  coordinates: Array<number>;
  address: string;
  description: string;
}

interface Location {
  coordinates: Array<number>;
  address: string;
  description: string;
  day: number;
}

interface Itinerary {
  name: string;
  day: number;
  placeImages: Array<string>;
  placeDescription: string;
  remark: string;
}

export interface Tour {
  name: string;
  duration: number;
  maxGroupSize: number;
  accommodation?: string;
  covidSecure?: String;
  meal?: Meal;
  difficulty: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  priceDiscount?: number;
  description?: string;
  images?: Array<Images>;
  imageCover?: Array<string>;
  startDates?: Array<Date>;
  startLocations?: StartLocation;
  locations?: Array<Location>;
  itinerary?: Array<Itinerary>;
  additionalService?: string;
  flights?: string;
  optional?: string;
  secretTour?: boolean;
}

export interface TourBaseDocument extends Tour, Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  images?: Types.Array<Images>;
  imageCover?: Types.Array<string>;
  startDates?: Types.Array<Date>;
  locations?: Types.Array<Location>;
  itinerary?: Types.Array<Itinerary>;
  duratinWeek: number;
}

export interface TourDocument extends TourBaseDocument {
  guides?: Types.Array<UserDocument['_id']>;
}

export interface TourPopulatedDocument extends TourBaseDocument {
  guides?: Types.Array<UserDocument>;
}
