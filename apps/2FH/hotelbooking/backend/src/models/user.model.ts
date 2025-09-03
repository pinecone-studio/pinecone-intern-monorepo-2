import { Schema, model, models, Model } from 'mongoose';
import { Role } from '../generated';

type UserType = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: Role;
  dateOfBirth?: string;
};

const userSchema = new Schema<UserType>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
    dateOfBirth: { type: String },
  },
  { timestamps: true }
);

export const UserModel: Model<UserType> = models['User'] || model<UserType>('User', userSchema);
