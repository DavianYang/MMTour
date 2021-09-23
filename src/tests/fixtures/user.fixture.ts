import mongoose from 'mongoose';
import faker from 'faker';
import { userModel } from '@/models/users.model';

const password = 'pass1123456';

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
};

const inserUsers = async (users: any) => {
  await userModel.create(users, { validateBeforeSave: false });
};

const deleteUser = async (user: any) => {
  await userModel.deleteOne({ id: user.id });
};

export { userOne, userTwo, admin, inserUsers, deleteUser };
