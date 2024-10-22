import mongoose from 'mongoose';
import faker from 'faker';

const tourFullOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  duration: 5,
  maxGroupSize: Math.floor(Math.random() * (100 - 10) + 10),
  accommodation: faker.lorem.sentences(),
  covidSecure: faker.lorem.sentences(),
  meal: {
    name: faker.lorem.sentences(),
    badge: ['Jain Food', 'Vegetarian Food'],
  },
  difficulty: 'medium',
  ratingsAverage: 4.5,
  ratingsQuantity: 20,
  price: 300,
  description: faker.lorem.paragraphs(),
  images: [
    {
      image: `${faker.image.imageUrl()}.jpeg`,
      placeName: faker.name.findName(),
    },
    {
      image: `${faker.image.imageUrl()}.jpg`,
      placeName: faker.name.findName(),
    },
    {
      image: `${faker.image.imageUrl()}.png`,
      placeName: faker.name.findName(),
    },
  ],
  imageCover: [`${faker.image.imageUrl()}.jpeg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.png`],
  startDates: [faker.date.future(), faker.date.future(), faker.date.future()],
  startLocation: {
    type: 'Point',
    description: 'Miami, USA',
    coordinates: [-80.185942, 25.774772],
    address: '301 Biscayne Blvd, Miami, FL 33132, USA',
  },
  locations: [
    {
      _id: '5c88fa8cf4afda39709c2959',
      description: 'Lummus Park Beach',
      type: 'Point',
      coordinates: [-80.128473, 25.781842],
      day: 1,
    },
    {
      _id: '5c88fa8cf4afda39709c2958',
      description: 'Islamorada',
      type: 'Point',
      coordinates: [-80.647885, 24.909047],
      day: 2,
    },
    {
      _id: '5c88fa8cf4afda39709c2957',
      description: 'Sombrero Beach',
      type: 'Point',
      coordinates: [-81.0784, 24.707496],
      day: 3,
    },
    {
      _id: '5c88fa8cf4afda39709c2956',
      description: 'West Key',
      type: 'Point',
      coordinates: [-81.768719, 24.552242],
      day: 5,
    },
  ],
  itinerary: [
    {
      name: faker.name.title(),
      day: 1,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 2,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 3,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 4,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 5,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 6,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 7,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 8,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
    {
      name: faker.name.title(),
      day: 9,
      placeImages: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
      placeDescription: faker.lorem.paragraphs(),
      remark: faker.lorem.sentences(),
    },
  ],
  additionalService: faker.lorem.sentences(),
  flights: faker.lorem.sentences(),
  optional: faker.lorem.sentences(),
};

export { tourFullOne };
