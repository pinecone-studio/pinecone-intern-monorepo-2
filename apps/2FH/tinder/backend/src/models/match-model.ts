import { Schema, model, models, Model, Types } from "mongoose";
 
export type MatchType = {
  likeduserId: Types.ObjectId;
  matcheduserId: Types.ObjectId;
  matchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
const matchSchema = new Schema<MatchType>(
  {
    likeduserId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    matcheduserId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    matchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
 
export const Match: Model<MatchType> =
  models.Match || model<MatchType>("Match", matchSchema);
 