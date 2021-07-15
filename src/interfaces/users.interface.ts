import { Document } from 'mongoose';

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
