import request from 'supertest';
import App from '@/app';
import { connectToDB, closeDB, clearDB } from '@tests/utils/setupTestDB';
import { TourRoute } from '@routes/tours.route';

describe('Testing Tours', () => {
  beforeAll(async () => await connectToDB());
  // afterEach(async () => await clearDB);
  // afterAll(async () => await closeDB())

  const app = new App([new TourRoute()]).getServer();

  describe('/api/v1/tours/', () => {
    it('GET: / should return a list of tours', async () => {
      const res = await request(app).get('/api/v1/tours').expect(200);
      expect(res.body.status).toMatch('success');
      expect(res.body.results).toBeGreaterThanOrEqual(9);
    });
  });

  describe('/api/v1/tours/:id', () => {
    it('GET: / should return a certain tour with given id', async () => {
      const id = '5c88fa8cf4afda39709c2955';
      const res = await request(app).get(`/api/v1/tours/${id}`).expect(200);
      expect(res.body.status).toMatch('success');
    });
  });

  describe('/api/v1/tours/top/:number', () => {
    it('GET: / should return 5 top tour', async () => {
      const number = 5;
      const res = await request(app).get(`/api/v1/tours/top/${number}`);
      expect(res.body.results).toBe(5);
    });
  });

  // describe('/api/v1/tours/stats', () => {
  //   it('GET: / should return the tour statistics', async () => {
  //     const res = await request(app)
  //       .get('/api/v1/tours/stats')
  //       .set('Authorization', `Bearer ${process.env.TEST_ADMIN_ACCESS_TOKEN}`)
  //       .expect('Content-Type', /json/)
  //       .expect(200);

  //     expect(res.body.status).toMatch('success');
  //     expect(res.body.data.stats).toHaveLength(3);
  //   });
  // });
});
