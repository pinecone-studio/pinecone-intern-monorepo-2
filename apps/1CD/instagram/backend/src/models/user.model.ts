import { Schema, model } from 'mongoose';

export type UserType = {
  _id: Schema.Types.ObjectId;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  gender: string;
  profileImg: string;
  accountVisibility: string;
  followerCount: number;
  followingCount: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
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
    enum: ['public', 'private'],
    default: 'public',
  },
  followerCount: {
    type: Number,
  },
  followingCount: {
    type: Number,
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
});

export const userModel = model('userModel', userSchema);
