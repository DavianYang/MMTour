import request from 'supertest';
import App from '@/app';
import { connectToDB, closeDB, clearDB } from '@tests/utils/setupTestDB';
import { TourRoute } from '@routes/tours.route';

describe('Testing Tours', () => {
  describe('/api/v1/tours/', () => {
    beforeAll(async () => await connectToDB());
    // afterEach(async () => await clearDB);
    // afterAll(async () => await closeDB())

    it('GET: / should return a list of tours', async () => {
      const tourRoute = new TourRoute();
      const app = new App([tourRoute]);

      const res = await request(app.getServer()).get('/api/v1/tours').expect(200);
      expect(res.body.results).toBe(9);
    });
  });
});
