import mongoose from 'mongoose';

const allNotificationSchema = new mongoose.Schema({
  orderNumber: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Хүлээгдэж буй', 'Бэлтгэгдэж буй', 'Амжилтай'],
  },
  createdAt: { type: Date, default: Date.now },
});
export const allNotification = mongoose.models.allNotification || mongoose.model('AllNotification', allNotificationSchema);
