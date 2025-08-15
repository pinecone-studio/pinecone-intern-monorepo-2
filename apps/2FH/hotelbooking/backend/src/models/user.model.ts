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
  password: {
    type: string;
    select: false;
  };
  role: role;
  dateOfBirth: string;
};

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role), required: true, default: role.USER },
    dateOfBirth: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<userType> = models['User'] || model('User', userSchema);
