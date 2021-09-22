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
  isPasswordMatch(candidatePassword: string, userPassword: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  isEmailTaken(email: string): boolean;
}

export interface UserInCreate {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
