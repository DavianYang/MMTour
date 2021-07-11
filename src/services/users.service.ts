import { Request } from 'express';
import { userModel } from '@models/users.model';
import { findAll, findOne, updateOne, deleteOne } from '@services/factory.service';

class UsersService {
  public users = userModel;

  public async findAllUsers(req: Request) {
    return await findAll(this.users, req.query);
  }

  public async findUser(req: Request) {
    return await findOne(this.users, req.params.id);
  }
  public async updateUser(req: Request) {
    return await updateOne(this.users, req.params.id, req.body);
  }

  public async deleteUser(req: Request) {
    return await deleteOne(this.users, req.params.id);
  }
}

export default UsersService;
