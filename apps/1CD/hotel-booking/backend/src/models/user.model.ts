import { Schema, model, models } from 'mongoose';

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: number;
  role: 'user' | 'admin';
  createdAt: Date;
};

const userSchema = new Schema<UserType>({
  firstName: {
    type: String,
    required: [true, 'Хэрэглэгчийн нэрийг оруулах'],
  },

  lastName: {
    type: String,
    required: [true, 'Хэрэглэгчийн нэрийг оруулах'],
  },
  email: {
    type: String,
    required: [true, 'Хэрэглэгчийн имейл оруулах'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Хэрэглэгчийн нууц үг оруулах'],
  },
  phoneNumber: {
    type: Number,
  },
  role: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const userModel = models['user'] || model('user', userSchema);
