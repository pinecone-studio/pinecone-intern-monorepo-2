import mongoose from "mongoose";
const { Schema, model, models} = mongoose;
 
const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "both"], required: true },
    bio: { type: String, required: true },
    interests: { type: [String], required: true },
    profession: { type: String, required: true },
    work: { type: String, required: true },
    images: { type: [String], required: true },
    dateOfBirth: { type: Date, required: true },
  }, { timestamps: true });
  
  export const Profile = models.Profile || model("Profile", profileSchema);