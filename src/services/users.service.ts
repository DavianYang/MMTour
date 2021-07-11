import { Request } from 'express';
import { userModel } from '@models/users.model';
import { GetMeRequest } from '@interfaces/users.interface';
import { findAll, findOne, updateOne, deleteOne } from '@services/factory.service';

class UsersService {
  public users = userModel;

  private filterObj = (obj: string, ...allowedFields: string[]) => {
    // interface filteredObj {
    //   [key: string]: string | undefined;
    // }
    const newObj = {};

    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
  };

  public async updateCurrentUser(req: GetMeRequest) {
    const filteredObj = this.filterObj(req.body, 'name', 'email');

    const updatedUser = await this.users.findByIdAndUpdate(req.user.id, filteredObj, {
      runValidators: true,
      new: true,
    });

    return updatedUser;
  }

  public async deleteCurrentUser(req: GetMeRequest) {
    return this.users.findByIdAndUpdate(req.user.id, {
      active: false,
    });
  }

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
