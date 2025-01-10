import { model, models, Schema } from 'mongoose';

export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  otp?: string;
  bio: string;
  age: number;
  gender: string;
  interests: [string];
  photos: [string];
  preferredGender: string;
  profession: string;
  schoolWork: [string];
  attraction: string;
  createdAt: Date;
  updatedAt: Date;
  otpCreatedAt: Date;
};

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
  },
  bio: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'both'],
  },
  interests: {
    type: [],
  },
  photos: {
    type: [],
  },
  preferredGender: {
    type: String,
    enum: ['male', 'female', 'both'],
  },
  profession: {
    type: String,
  },
  schoolWork: {
    type: [],
  },
  attraction: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  otpCreatedAt: { 
    type: Date,
    default: Date.now,
  },
});

export const userModel = models['user'] || model('user', userSchema);