import { Schema, model, models } from 'mongoose';

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  password: string;
  phoneNumber?: number;
  role: 'user' | 'admin';
  createdAt: Date;
};

const userSchema = new Schema<UserType>({
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Хэрэглэгчийн имейл оруулах'],
    unique: true,
  },
  otp: { type: String },
  password: {
    type: String,
    // required: [true, 'Хэрэглэгчийн нууц үг оруулах'],
  },
  phoneNumber: {
    type: Number,
  },
  role: {
    type: String,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const userModel = models['user'] || model('user', userSchema);
