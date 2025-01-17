import request from 'supertest';
import faker from 'faker';
import App from '@/app';
import { connectToDB, closeDB } from '@tests/e2e/utils/setupTestDB';
import { userModel } from '@models/users.model';
import { UserService } from '@services/users.service';
import { UserRoute } from '@routes/users.route';
import { userOne, userTwo, inserUsers, deleteUser } from '@tests/fixtures/user.fixture';

beforeAll(async () => await connectToDB());
afterAll(async () => await closeDB());

describe('Testing Authorization', () => {
  const app = new App([new UserRoute()]).getServer();
  const userService = new UserService();

  describe('/api/v1/users/signup', () => {
    const path = '/api/v1/users/signup';
    let userSignup: any;

    beforeEach(() => {
      userSignup = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password12345',
        passwordConfirm: 'password12345',
      };
    });

    afterEach(async () => {
      await userModel.deleteOne({ name: userSignup.name });
    });

    it('POST: / should register user if required given data is provided', async () => {
      const res = await request(app).post(path).send(userSignup).expect(201);

      expect(res.body.status).toMatch('success');
      expect(res.body.token).not.toBeNull();

      expect(res.body.data.user).toMatchObject({
        role: 'user',
        active: true,
        name: userSignup.name,
        email: userSignup.email,
      });

      const dbUser = await userService.findUserById(res.body.data.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(userSignup.password);
    });
  });

  describe('/api/v1/users/login', () => {
    const path = '/api/v1/users/login';

    beforeEach(async () => await inserUsers([userOne]));
    afterEach(async () => await deleteUser(userOne));

    it('POST: / should login user if email and password match', async () => {
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app).post(path).send(loginCredentials).expect(200);

      expect(res.body.status).toMatch('success');
      expect(res.body.token).not.toBeNull();

      expect(res.body.data.user).toMatchObject({
        _id: expect.anything(),
        name: userOne.name,
        email: userOne.email,
        role: 'user',
      });
    });
  });

  describe('/api/v1/users/logout', () => {
    const path = '/api/v1/users/logout';
    beforeEach(async () => await inserUsers([userOne]));
    afterEach(async () => await deleteUser(userOne));

    it('POST: / should return 204 status if refresh token is valid', async () => {
      await request(app).post(path).send({}).expect(204);
    });
  });
});
