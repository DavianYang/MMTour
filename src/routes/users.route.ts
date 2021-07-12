import { Router } from 'express';
import { UserController } from '@controllers/users.controller';

class UserRoute {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router
      .route(`${this.path}/me`)
      .get(this.userController.getMe) // protect in auth would fix this error
      .get(this.userController.getUser)
      .patch(this.userController.updateMe)
      .delete(this.userController.deleteUser);

    this.router.route(`${this.path}/`).get(this.userController.getAllUsers).post(this.userController.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(this.userController.getUser)
      .patch(this.userController.updateUser) // Only Admin Role
      .delete(this.userController.deleteUser); // Only Admin Role
  }
}

export { UserRoute };
