import { model, models, Schema, Types } from 'mongoose';

export type NotificationsType = {
  _id: string;
  otherUserId: Types.ObjectId;
  currentUserId: Types.ObjectId;
  notificationType: string;
  newFollowerId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
};
const NotificationsSchema = new Schema<NotificationsType>({
  otherUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  currentUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  notificationType: { type: String, required: true, enum: ['comment', 'follow', 'like'] },
  newFollowerId: { type: Schema.Types.ObjectId, ref: 'followModel' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export const notificationModel = models['notificationModel'] || model('notificationModel', NotificationsSchema);
