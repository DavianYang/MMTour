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
    this.router.route(`${this.path}/`).get(this.usersController.getAllUsers).post(this.usersController.createUser);

    this.router
      .route(`${this.path}/:id`)
      .get(this.usersController.getUser)
      .patch(this.usersController.updateUser)
      .delete(this.usersController.deleteUser);
  }
}

export default UsersRoute;
