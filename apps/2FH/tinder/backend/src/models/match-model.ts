import { Schema, model, models, Model, Types } from "mongoose";
 
export type MatchType = {
  likeduser: Types.ObjectId;
  matcheduser: Types.ObjectId;
  matchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
const matchSchema = new Schema<MatchType>(
  {
    likeduser: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    matcheduser: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    matchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
 
export const Match: Model<MatchType> =
  models.Match || model<MatchType>("Match", matchSchema);
 