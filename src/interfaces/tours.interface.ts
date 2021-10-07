import { Document, Types } from 'mongoose';

export interface TourDocument extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  accommodation: string;
  covidSecure: String;
  meal: String;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  images: [string];
  imageCover: string;
  createdAt: Date;
  updatedAt: Date;
  startDates: [Date];
  endDates: [Date];
  startLocations: {
    coordinates: [number];
    address: string;
    description: string;
  };
  locations: [
    {
      coordinates: [number];
      address: string;
      description: string;
      day: number;
    },
  ];
  itinerary: [
    {
      name: string;
      day: number;
      image: string;
      placeDescription: string;
      remark: string;
    },
  ];
  additionalService: string;
  flights: string;
  optional: string;
  secretTour: boolean;
  guides: [Types.ObjectId];
}
