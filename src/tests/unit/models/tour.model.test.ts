import faker from 'faker';
import { tourModel } from '@models/tours.model';

describe('Tour model', () => {
  describe('tour validation', () => {
    let newTour: any;
    beforeEach(() => {
      newTour = {
        name: faker.name.title(),
        duration: 5,
        maxGroupSize: 25,
        difficulty: 'easy',
        ratingsAverage: 4.7,
        ratingsQuantity: 37,
        price: faker.commerce.price(),
        summary: 'Breathtaking hike through the Canadian Banff National Park',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris n.',
        images: [`${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`, `${faker.image.imageUrl()}.jpg`],
        startDates: [faker.date.future(), faker.date.future(), faker.date.future()],
        startLocation: {
          type: 'Point',
          description: 'Miami, USA',
          coordinates: [-80.185942, 25.774772],
          address: '301 Biscayne Blvd, Miami, FL 33132, USA',
        },
      };
    });

    test('should correctly validate a valid tour', async () => {
      console.log(newTour);
      await expect(new tourModel(newTour).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if given image url is incorrect for imageCover field', async () => {
      newTour.imageCover = 'imagecoverurl';
      await expect(new tourModel(newTour).validate()).rejects.toThrow();
    });

    test('should throw a validation error if given image url is incorrect for images field', async () => {
      newTour.images = 'manyimages';
      await expect(new tourModel(newTour).validate()).rejects.toThrow();
    });
  });
});
