import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ from: 1, to: 1 }, { unique: true });  

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);
export default Like;