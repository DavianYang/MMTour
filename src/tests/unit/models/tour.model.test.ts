import { tourModel } from '@models/tours.model';
import { tourFullOne } from '@tests/fixtures/tour.fixture';

describe('Tour model', () => {
  describe('tour validation', () => {
    test('should correctly validate a valid tour', async () => {
      await expect(new tourModel(tourFullOne).validate()).resolves.toBeUndefined();
    });

    // Images
    describe('Validate Images', () => {
      test('should throw a validation error if given image url is incorrect for imageCover field', async () => {
        tourFullOne.imageCover = ['imagecoverurl'];
        await expect(new tourModel(tourFullOne).validate()).rejects.toThrow();
      });

      test('should throw a validation error if given image url is incorrect for images field', async () => {
        tourFullOne.images = [{ image: 'imageurl', placeName: 'Bruh' }];
        await expect(new tourModel(tourFullOne).validate()).rejects.toThrow();
      });
    });
  });
});
