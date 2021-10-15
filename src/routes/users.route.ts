import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { AuthController } from '@controllers/auth.controller';
import { protect, restrictTo } from '@middlwares/auth.middleware';
import { resizeUserImage } from '@middlwares/user.middleware';
import { upload } from '@middlwares/image.middleware';

class UserRoute {
  public path = '/users';
  public router = Router();
  public userController = new UserController();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signUp);
    this.router.post(`${this.path}/login`, this.authController.logIn);
    this.router.post(`${this.path}/logout`, this.authController.logOut);

    this.router.post(`${this.path}/forgotPassword`, this.authController.forgotPassword); // Not tested yet
    this.router.patch(`${this.path}/resetPassword/:token`, this.authController.resetPassword); // Not tested yet

    this.router.use(protect);

    this.router.patch(`${this.path}/updateMyPassword`, this.authController.updatePassword); // Not tested yet

    this.router
      .route(`${this.path}/me`)
      .get(this.userController.getMe)
      .get(this.userController.getUser)
      .patch(upload.single('photo'), resizeUserImage, this.userController.updateMe) // Image not tested
      .delete(this.userController.deleteUser);

    this.router.use(restrictTo('admin'));

    this.router.route(`${this.path}/`).get(this.userController.getAllUsers).post(this.userController.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(this.userController.getUser)
      .patch(this.userController.updateUser)
      .delete(this.userController.deleteUser);
  }
}

export { UserRoute };
