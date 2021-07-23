import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '@models/users.model';
import { UserDocument } from '@interfaces/users.interface';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';

class AuthService {
  public users = userModel;

  private signJWTToken = (user: UserDocument) => {
    const id: string = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });

    // Remove the user password
    user.password = undefined;

    return token;
  };

  public signup = async (req: Request) => {
    const newUser = await this.users.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    return { token: this.signJWTToken(newUser), newUser };
  };

  public login = async (email: string, password: string) => {
    const user = await this.users.findOne({ email }).select('+password');
    const correctPassword = await this.users.correctPassword(password, user.password);
    return {
      token: this.signJWTToken(user),
      user,
      correctPassword,
    };
  };
}

export { AuthService };
