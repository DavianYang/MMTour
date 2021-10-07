import { Document, Types } from 'mongoose';

enum Badge {
  'Jain Food',
  'Vegetarian Food',
  'Halal Food',
  'Kosher Food',
}

interface Meal {
  name: String;
  badge: Badge[];
}

interface Images {
  image: String;
  placeName: String;
}

export interface TourDocument extends Document {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  accommodation: string;
  covidSecure: String;
  meal: Meal;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  images: Images[];
  imageCover: [string];
  createdAt: Date;
  updatedAt: Date;
  startDates: [Date];
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
      images: [string];
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
