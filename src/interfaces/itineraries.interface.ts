import { Document, Types } from 'mongoose';

export interface Itinerary {
  name: string;
  day: number;
  placeImages?: Array<string>;
  placeDescription?: string;
  remark?: string;
}

export interface ItineraryBaseDocument extends Document, Itinerary {
  placeImages?: Types.Array<string>;
}

export type ItineraryDocument = ItineraryBaseDocument;
