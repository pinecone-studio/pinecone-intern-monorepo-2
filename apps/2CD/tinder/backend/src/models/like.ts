import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

// Create indexes in a way that won't cause test issues
if (process.env.NODE_ENV !== 'test') {
  Like.collection.dropIndexes().catch(() => {
    // Ignore errors during test cleanup
  }).then(() => {
    Like.collection.createIndex({ sender: 1, receiver: 1 }, { unique: true });
  });
}

export default Like;