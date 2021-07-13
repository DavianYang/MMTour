import { Document } from 'mongoose';
import { Request } from 'express';

export interface UserDocument extends Document {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpire: Date;
  active: boolean;
}

export interface GetMeRequest extends Request {
  user: any; // or any other type
}
