import { Request } from 'express';
import { userModel } from '@models/users.model';
import { QueryString, filterObj } from '@interfaces/queries.interface';
import { findAll, findOne, updateOne, deleteOne } from '@services/factory.service';

class UserService {
  public users = userModel;

  private filterObj = (obj: filterObj, ...allowedFields: string[]) => {
    const newObj: filterObj = {};

    Object.keys(obj).forEach((el: string) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
  };

  public async updateCurrentUser(req: Request) {
    const filteredObj = this.filterObj(req.body, 'name', 'email');

    const updatedUser = await this.users.findByIdAndUpdate(req.user.id, filteredObj, {
      runValidators: true,
      new: true,
    });

    return updatedUser;
  }

  public async deleteCurrentUser(req: Request) {
    return this.users.findByIdAndUpdate(req.user.id, {
      active: false,
    });
  }

  public async createUser(req: Request) {
    return await this.users.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
  }

  public async findAllUsers(req: Request) {
    return await findAll(this.users, req.query as QueryString);
  }

  public async findUser(req: Request) {
    return await findOne(this.users, req.params.id);
  }

  public async findUserByEmail(email: string) {
    return await this.users.findOne({ email }).select('+password');
  }

  public async findUserByToken(hashToken: string) {
    return await this.users.findOne({ passwordResetToken: hashToken, passwordResetExpire: { $gte: Date.now() } });
  }

  public async updateUser(req: Request) {
    return await updateOne(this.users, req.params.id, req.body);
  }

  public async deleteUser(req: Request) {
    return await deleteOne(this.users, req.params.id);
  }
}

export { UserService };
