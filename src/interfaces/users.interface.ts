import { Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: number;
  passwordResetToken: string;
  passwordResetExpire: Date;
  active: boolean;
}
