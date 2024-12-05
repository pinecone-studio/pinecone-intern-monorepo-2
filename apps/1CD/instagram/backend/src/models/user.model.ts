import { Schema, model, models } from 'mongoose';
import { AccountVisibility } from 'src/generated';

export type UserType = {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  gender: string;
  profileImg: string;
  accountVisibility: AccountVisibility;
  followerCount: number;
  followingCount: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  resetPasswordToken: string;
  resetPasswordTokenExpire: Date;
};

const userSchema = new Schema<UserType>({
  userName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  bio: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'custom', 'prefer not to say'],
  },
  profileImg: {
    type: String,
  },
  accountVisibility: {
    type: String,
    enum: [AccountVisibility.Private, AccountVisibility.Public],
    default: AccountVisibility.Public,
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  otp: {
    type: String,
  },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpire: { type: Date },
});

export const userModel = models['userModel'] || model('userModel', userSchema);
