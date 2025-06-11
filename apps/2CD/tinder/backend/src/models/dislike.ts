import mongoose from 'mongoose';

const dislikeSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dislike = mongoose.models.Dislike || mongoose.model('Dislike', dislikeSchema);

// Create indexes in a way that won't cause test issues
if (process.env.NODE_ENV !== 'test') {
  Dislike.collection.dropIndexes().catch(() => {
    // Ignore errors during test cleanup
  }).then(() => {
    Dislike.collection.createIndex({ sender: 1, receiver: 1 }, { unique: true });
  });
}

export default Dislike; 