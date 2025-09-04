import { Types } from "mongoose";
import { ProfileType } from "../models/profile-model";

export interface ProfileDocument extends ProfileType {
  _id: Types.ObjectId;
}

export interface GraphQLProfile {
  id: string;
  userId: string;
  name: string;
  gender: string;
  interestedIn: string;
  bio: string;
  interests: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth: string;
  likes: string[];
  matches: string[];
  createdAt: Date;
  updatedAt: Date;
}