import { Document, Model } from 'mongoose';

enum Role {
  Admin = 'admin',
  LeadGuide = 'lead-guide',
  Guide = 'guide',
  User = 'user',
}

export interface User {
  name: string;
  email: string;
  photo: string;
  role: Role;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpire: Date;
  active: boolean;
}

export interface UserDocument extends User, Document {
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  createPasswordResetToken(): string;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

export type UserModel = Model<UserDocument>;
