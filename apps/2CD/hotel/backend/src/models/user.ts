/* eslint-disable no-unused-vars */
import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  email: string;
  phoneNumber: string;
  bookings: mongoose.Types.ObjectId[];
  role: UserRole;
  reviews: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String },
    phoneNumber: { type: String },
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
