import { Schema, model, Model, HookNextFunction, Query, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UserDocument, User } from '@interfaces/users.interface';

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: UserDocument, el: string): boolean {
        return el == this.password;
      },
      message: 'Password are not the same!!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: true,
  },
});

userSchema.pre<UserDocument>('save', async function (next: HookNextFunction) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<UserDocument>('save', function (next: HookNextFunction) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<Query<UserDocument, UserDocument>>(/^find/, function (next: HookNextFunction) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (this: UserDocument, JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(`${this.passwordChangedAt.getTime() / 1000}`, 10);

    return JWTTimeStamp < changedTimestamp;
  }

  return false;
};

const userModel = model<UserDocument>('User', userSchema);

export { userModel };
