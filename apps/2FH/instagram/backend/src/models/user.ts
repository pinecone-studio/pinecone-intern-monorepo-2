import { Schema, model, Model, models, Types } from "mongoose";

/* eslint-disable no-unused-vars */
export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "OTHER",
}
/* eslint-enable no-unused-vars */

export type UserSchemaType = {
  fullName: string;
  userName: string;
  email?: string;
  password: string;
  bio?: string;
  phoneNumber?: string;
  profileImage?: string;
  gender: Gender;
  isPrivate: boolean;
  isVerified: boolean;
  posts: Types.ObjectId[];
  stories: Types.ObjectId[];
  followers: Types.ObjectId[];
  followings: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserSchemaType>(
  {
    fullName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    bio: { type: String, maxlength: 150 },
    profileImage: { type: String },
    gender: { type: String, enum: Object.values(Gender), required: true },
    isPrivate: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, 
  }
);

export const User =
  (models.User as Model<UserSchemaType>) || model<UserSchemaType>("User", UserSchema);
