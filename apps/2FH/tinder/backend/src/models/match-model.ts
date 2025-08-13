import { Schema, model, models, Model, Types } from "mongoose";

 
export type MatchType = {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  matchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
const matchSchema = new Schema<MatchType>(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
 
export const Match: Model<MatchType> =
  models.Match || model<MatchType>("Match", matchSchema);