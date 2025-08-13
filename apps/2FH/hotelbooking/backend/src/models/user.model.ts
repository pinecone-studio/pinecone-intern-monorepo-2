/* eslint-disable no-unused-vars */
import { Schema, model, models, Model } from 'mongoose';

enum role {
  ADMIN = 'admin',
  USER = 'user',
}

type userType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: role;
  dateOfBirth: Date;
};

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role), required: true, default: role.USER },
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<userType> = models['User'] || model('User', userSchema);
