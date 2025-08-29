import { Schema, model, models, Model } from 'mongoose';

type Role = 'admin' | 'user';

type UserType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password: {
    type: string;
    select: false;
  };
  role?: Role;
  dateOfBirth?: string;
};

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String },
    dateOfBirth: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const UserModel: Model<UserType> = models['User'] || model('User', userSchema);
