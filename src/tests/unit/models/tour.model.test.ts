import faker from 'faker';
import { tourModel } from '@models/tours.model';
import { tourFullOne } from '@tests/fixtures/tour.fixture';

describe('Tour model', () => {
  describe('Tour validation', () => {
    test('should correctly validate a valid tour', async () => {
      await expect(new tourModel(tourFullOne).validate()).resolves.toBeUndefined();
    });

    // Images
    describe('Images Validation', () => {
      test('should throw a validation error if given image url is incorrect for imageCover, images field', async () => {
        tourFullOne.imageCover = ['imagecoverurl'];
        tourFullOne.images = [{ image: 'imageurl', placeName: 'Bruh' }];

        await expect(new tourModel(tourFullOne).validate()).rejects.toThrow();
      });

      test('should throw a validation error if given imageCover exceed limit of 5', async () => {
        tourFullOne.images = [
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
          {
            image: `${faker.image.imageUrl()}.jpg`,
            placeName: faker.name.findName(),
          },
        ];

        tourFullOne.imageCover = [
          `${faker.image.imageUrl()}.jpg`,
          `${faker.image.imageUrl()}.jpg`,
          `${faker.image.imageUrl()}.jpg`,
          `${faker.image.imageUrl()}.jpg`,
          `${faker.image.imageUrl()}.jpg`,
          `${faker.image.imageUrl()}.jpg`,
        ];
        await expect(new tourModel(tourFullOne).validate()).rejects.toThrow();
      });
    });
  });
});
