import { Schema, model } from 'mongoose';
import { ItineraryDocument } from '@interfaces/itineraries.interface';

const itinerarySchema = new Schema<ItineraryDocument>({
  name: {
    type: String,
    required: [true, 'An itinerary must have a name'],
    minLength: [20, 'Itinerary name must have at least {MINLENGTH} characters'],
    maxLength: [250, 'Itinerary name must have at most {MAXENGTH} characters'],
  },
  day: { type: Number, required: [true, 'An itinerary must have a day'] },
  images: [String],
  description: {
    type: String,
    minLength: [300, 'Itinerary description must have at least {MINLENGTH} characters'],
    maxLength: [2000, 'Itinerary description must have at most {MAXENGTH} characters'],
  },
  remark: {
    type: String,
    maxLength: [500, 'Itinerary remark must have at most {MAXENGTH} characters'],
  },
});

const itineraryModel = model<ItineraryDocument>('Itinerary', itinerarySchema);

export { itineraryModel };
