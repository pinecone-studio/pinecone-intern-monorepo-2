import { Schema, model, models, Model,} from "mongoose";
 
export type UserType = {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
 
const userSchema = new Schema<UserType>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
 
export const User: Model<UserType> =
  models.User || model<UserType>("User", userSchema);