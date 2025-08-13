/* eslint-disable no-unused-vars */
import { Schema, model, models, Model, Types } from "mongoose";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum GenderPreference {
  MALE = "male",
  FEMALE = "female", 
  OTHER = "other",
  ALL = "all",
}

export type ProfileType = {
  user: Types.ObjectId;
  name: string;
  gender: Gender; 
  genderPreference: GenderPreference[]; 
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
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    gender: { 
      type: String, 
      enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER], 
      required: true 
    },
    genderPreference: { 
      type: [String], 
      enum: [GenderPreference.MALE, GenderPreference.FEMALE, GenderPreference.OTHER, GenderPreference.ALL],
      required: true,
      validate: {
        validator: function(arr: string[]) {
          return arr.length > 0;
        },
        message: 'At least one gender preference must be selected'
      }
    },
    bio: { 
      type: String, 
      required: true 
    },
    interests: { 
      type: [String], 
      required: true 
    },
    profession: { 
      type: String, 
      required: true 
    },
    work: { 
      type: String, 
      required: true 
    },
    images: { 
      type: [String], 
      required: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
  },
  { timestamps: true }
);

profileSchema.index({ gender: 1, genderPreference: 1 });

export const Profile: Model<ProfileType> =
  models.Profile || model<ProfileType>("Profile", profileSchema);