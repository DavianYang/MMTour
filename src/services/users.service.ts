import { Request } from 'express';
import { userModel } from '@models/users.model';
import { QueryString, filterObj } from '@interfaces/queries.interface';
import { findAll, findOne, updateOne, deleteOne } from '@services/factory.service';
import { UserInCreate } from '@interfaces/users.interface';

class UserService {
  public users = userModel;

  private filterObj = (obj: filterObj, ...allowedFields: string[]) => {
    const newObj: filterObj = {};

    Object.keys(obj).forEach((el: string) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
  };

  // CREATE
  public async createUser(userBody: UserInCreate) {
    return await this.users.create({
      name: userBody.name,
      email: userBody.email,
      password: userBody.password,
      passwordConfirm: userBody.passwordConfirm,
    });
  }

  // FIND
  public async findAllUsers(query: object) {
    return await findAll(this.users, query as QueryString);
  }

  public async findUser(id: string) {
    return await findOne(this.users, id);
  }

  public async findUserById(id: string) {
    return await this.users.findOne({ id }).select('+password');
  }

  public async findUserByEmail(email: string) {
    return await this.users.findOne({ email }).select('+password');
  }

  public async findUserByToken(hashToken: string) {
    return await this.users.findOne({ passwordResetToken: hashToken, passwordResetExpire: { $gt: new Date() } });
  }

  // UPDATE
  public async updateUser(id: string, body: object) {
    return await updateOne(this.users, id, body);
  }

  public async updateCurrentUser(id: string, body: object) {
    const filteredObj = this.filterObj(body as filterObj, 'name', 'email');

    const updatedUser = await this.users.findByIdAndUpdate(id, filteredObj, {
      runValidators: true,
      new: true,
    });

    return updatedUser;
  }

  // DELETE
  public async deleteUser(id: string) {
    return await deleteOne(this.users, id);
  }

  public async deleteCurrentUser(id: string) {
    return this.users.findByIdAndUpdate(id, {
      active: false,
    });
  }
}

export { UserService };
