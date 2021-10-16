import { Schema, Types, model, Model, Query } from 'mongoose';

const bookingSchema = new Schema({});

const bookingModel = model('Booking', bookingSchema);

export { bookingModel };
