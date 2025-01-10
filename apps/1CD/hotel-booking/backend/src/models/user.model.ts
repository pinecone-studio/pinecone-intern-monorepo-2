import { Schema, model, models } from 'mongoose';

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: number;
  emergencyContact: string;
  emergencyStatus: 'spouse' | 'parents' | 'sibling' | 'friend' | 'partner' | 'child' | 'neighbor' | 'roommate';
  dateOfBirth: Date;
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
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  emergencyContact: {
    type: String,
  },

  emergencyStatus: {
    type: String,
    enum: ['spouse', 'parents', 'sibling', 'friend', 'partner', 'child', 'neighbor', 'roommate'],
  },

  dateOfBirth: {
    type: Date,
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
