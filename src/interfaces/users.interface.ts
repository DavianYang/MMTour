import { Document, Model } from 'mongoose';

export interface User {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpire: Date;
  active: boolean;
}

export interface UserDocument extends User, Document {
  changedPasswordAfter(JWTTimeStamp: number): boolean;
}

export interface UserModel extends Model<UserDocument> {
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}
