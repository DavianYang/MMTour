import { Schema, model, HookNextFunction, Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UserDocument } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
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
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<UserDocument>('save', function (next: HookNextFunction) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre<Query<UserDocument, UserDocument>>(/^find/, function (next: HookNextFunction) {
  this.find({ active: { $ne: false } });

  next();
});

const userModel = model<UserDocument>('User', userSchema);

export { userModel };
