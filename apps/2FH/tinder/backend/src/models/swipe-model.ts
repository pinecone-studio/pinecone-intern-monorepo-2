import { Schema, model, models, Model, Types } from "mongoose";
 
export type SwipeType = {
  swiperUser: Types.ObjectId;
  swipedUser: Types.ObjectId;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
};
 
const swipeSchema = new Schema<SwipeType>(
  {
    swiperUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    swipedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isLiked: { type: Boolean, required: true },
  },
  { timestamps: true }
);
 
export const Swipe: Model<SwipeType> =
  models.Swipe || model<SwipeType>("Swipe", swipeSchema);