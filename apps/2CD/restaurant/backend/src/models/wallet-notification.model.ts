import mongoose from 'mongoose';

const walletHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    requied: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const walletHistory = mongoose.models.walletHistory || mongoose.model('walletHistory', walletHistorySchema);
