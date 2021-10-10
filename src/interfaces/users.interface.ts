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
  photo?: string;
  password: string;
  passwordConfirm: string | undefined;
}

export interface UserBaseDocument extends User, Document {
  role: Role;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpire: Date;
  active: boolean;
  isPasswordMatch(candidatePassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  createPasswordResetToken(): string;
}

export type UserDocument = UserBaseDocument;

export interface UserModel extends Model<UserDocument> {
  isEmailTaken(email: string): boolean;
}
