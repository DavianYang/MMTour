import request from 'supertest';
import App from '@/app';
import { connectToDB, closeDB, clearDB } from '@tests/utils/setupTestDB';
import { UserRoute } from '@routes/users.route';

describe('Testing Users', () => {
  describe('/api/v1/users/', () => {
    beforeAll(async () => await connectToDB());
    // afterEach(async () => await clearDB);
    // afterAll(async () => await closeDB());

    test('GET: / should return a list of users', async () => {
      const userRoute = new UserRoute();
      const app = new App([userRoute]);

      const res = await request(app.getServer()).get('/api/v1/users').expect(200);
      expect(res.body.results).toBeGreaterThan(20);
    });
  });
});
