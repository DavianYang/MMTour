import request from 'supertest';
import App from '@/app';
import { IndexRoute } from '@routes/index.route';

describe('Testing Index', () => {
  const app = new App([new IndexRoute()]).getServer();
  describe('[GET] /api/v1/', () => {
    const path = '/api/v1/';
    test('response statusCode 200', () => {
      return request(app).get(path).expect(200);
    });
  });
});
