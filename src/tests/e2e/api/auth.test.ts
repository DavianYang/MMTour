import request from 'supertest';
import faker from 'faker';
import App from '@/app';
import { connectToDB, closeDB, clearDB } from '@tests/utils/setupTestDB';
import { UserService } from '@/services/users.service';
import { UserRoute } from '@routes/users.route';

describe('Testing Authorization', () => {
  const app = new App([new UserRoute()]).getServer();
  const userService = new UserService();

  beforeAll(async () => await connectToDB());
  // afterEach(async () => await clearDB);
  // afterAll(async () => await closeDB());

  describe('/api/v1/users/signup', () => {
    let newUser: any;
    const path = '/api/v1/users/signup';

    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
      };
    });

    it('POST: / should register user if required given data is provided', async () => {
      const res = await request(app)
        .post(path)
        .send({ ...newUser, passwordConfirm: newUser.password })
        .expect(201);

      expect(res.body.status).toMatch('success');
      expect(res.body.token).not.toBeNull();

      expect(res.body.data.user).toMatchObject({
        role: 'user',
        active: true,
        name: newUser.name,
        email: newUser.email,
      });

      const dbUser = await userService.findUserById(res.body.data.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
    });
  });
});
