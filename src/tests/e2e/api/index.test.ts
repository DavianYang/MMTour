import request from 'supertest';
import App from '@/app';
import { IndexRoute } from '@routes/index.route';

describe('Testing Index', () => {
  describe('[GET] /api/v1/', () => {
    test('response statusCode 200', () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);

      return request(app.getServer()).get(`/api/v1/`).expect(200);
    });
  });
});
