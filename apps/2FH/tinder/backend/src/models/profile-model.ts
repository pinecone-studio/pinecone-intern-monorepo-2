/* eslint-disable no-unused-vars */
 
import  { Schema, model, models, Model, Types } from "mongoose";
 
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  BOTH = "both",
}
 
export type ProfileType = {
  user: Types.ObjectId;
  name: string;
  gender: Gender;
  bio: string;
  interests: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
const profileSchema = new Schema<ProfileType>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender), default: Gender.BOTH, required: true },
    bio: { type: String, required: true },
    interests: { type: [String], required: true },
    profession: { type: String, required: true },
    work: { type: String, required: true },
    images: { type: [String], required: true },
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true }
);
 
export const Profile: Model<ProfileType> =
  models.Profile || model<ProfileType>("Profile", profileSchema);