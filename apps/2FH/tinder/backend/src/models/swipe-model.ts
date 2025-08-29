import  { Schema, model, models, Model, Types } from "mongoose";
 
export type SwipeType = {
  swiperId: Types.ObjectId;
  targetId: Types.ObjectId;
  action: 'LIKE' | 'DISLIKE' | 'SUPER_LIKE';
  swipedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
 
const swipeSchema = new Schema<SwipeType>(
  {
    swiperId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { 
      type: String, 
      enum: ['LIKE', 'DISLIKE', 'SUPER_LIKE'], 
      required: true 
    },
    swipedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
 
export const Swipe: Model<SwipeType> =
  models.Swipe || model<SwipeType>("Swipe", swipeSchema);
 