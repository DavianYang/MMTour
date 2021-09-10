import { Document, Types } from 'mongoose';

export interface TourDocument extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: [string];
  createdAt: Date;
  startDates: [Date];
  secretTour: boolean;
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
  guides: [Types.ObjectId];
}
