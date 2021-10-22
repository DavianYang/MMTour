import { Document, Types } from 'mongoose';
import { UserBaseDocument } from '@interfaces/users.interface';
import { ItineraryBaseDocument } from '@interfaces/itineraries.interface';

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
  duratinWeek: number;
}

export interface TourDocument extends TourBaseDocument {
  guides?: Types.Array<UserBaseDocument['_id']>;
  itineraries?: Types.Array<ItineraryBaseDocument['_id']>;
}

export interface TourPopulatedDocument extends TourBaseDocument {
  guides?: Types.Array<UserBaseDocument>;
  itineraries?: Types.Array<ItineraryBaseDocument>;
}
