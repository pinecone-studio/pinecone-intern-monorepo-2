import { Schema, model, models } from 'mongoose';

export type User = {
  _id: string;
  email: string;
  userName: string;
  profile: string;
  role: string;
  position: string;
  supervisor: string[];
  hireDate: Date;
};

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    userName: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    role: {
      type: String,
      enum: ['supervisor', 'supervisee', 'admin'],
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    supervisor: {
      type: [String],
    }
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model<User>('User', UserSchema);
