import request from 'supertest';
import App from '@/app';
import { connectToDB, closeDB, clearDB } from '@tests/utils/setupTestDB';
import { UserRoute } from '@routes/users.route';

describe('Testing Authorization', () => {
  beforeAll(async () => await connectToDB());
  // afterEach(async () => await clearDB);
  // afterAll(async () => await closeDB());
  describe('/api/v1/register', () => {});
});
