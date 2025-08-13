import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
 
const swipeSchema = new Schema({
    swiperUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    swipedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isLiked: { type: Boolean, required: true },
  }, { timestamps: true });
  
  export const Swipe = models.Swipe || model("Swipe", swipeSchema);