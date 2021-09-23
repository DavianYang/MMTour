import { AuthController } from '@controllers/auth.controller';
import { userOne, admin } from '@tests/fixtures/user.fixture';

const authController = new AuthController();

const userOneAccessToken = authController.signJWTToken(userOne._id);
const adminAccessToken = authController.signJWTToken(admin._id);

export { userOneAccessToken, adminAccessToken };
