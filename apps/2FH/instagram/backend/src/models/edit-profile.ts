// models/user.model.ts
import { Schema, model, models, Model } from 'mongoose';
import { Gender } from './user';

export type ProfileSchemaType = {
  fullName: string;
  userName: string;
  bio: string;
  gender: Gender;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProfileModel = Model<ProfileSchemaType>;

const UserSchema = new Schema<ProfileSchemaType, ProfileModel>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9._]+$/,
    },
    bio: { type: String, trim: true, maxlength: 150, default: '' },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    profileImage: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const EditProfile = (models.EditProfile as ProfileModel) || model<ProfileSchemaType, ProfileModel>('EditProfile', UserSchema);
