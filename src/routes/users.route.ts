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
    this.router.get(`${this.path}`, this.usersController.getUserAll);
  }
}

export default UsersRoute;
