import { Document } from 'mongoose';

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
  correctPassword(candidatePassword: string, userPassword: string): Promise<unknown>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
}
