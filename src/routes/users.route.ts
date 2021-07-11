import { Router } from 'express';
import UsersController from '@controllers/users.controller';

class UsersRoute {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router
      .route(`${this.path}/me`)
      .get(this.usersController.getMe) // protect in auth would fix this error
      .get(this.usersController.getUser)
      .patch(this.usersController.updateMe)
      .delete(this.usersController.deleteUser);

    this.router.route(`${this.path}/`).get(this.usersController.getAllUsers).post(this.usersController.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(this.usersController.getUser)
      .patch(this.usersController.updateUser) // Only Admin Role
      .delete(this.usersController.deleteUser); // Only Admin Role
  }
}

export default UsersRoute;
