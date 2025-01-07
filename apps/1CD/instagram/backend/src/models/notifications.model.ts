import { model, models, Schema, Types } from 'mongoose';
import { UserType } from './user.model';
import { Post } from './post.model';
import { NotificationType } from 'src/generated';

export type NotificationsType = {
  _id: string;
  otherUserId: Types.ObjectId;
  currentUserId: Types.ObjectId;
  notificationType: NotificationType;
  isViewed: boolean;
  postId: Types.ObjectId;
  createdAt: Date;
};
const NotificationsSchema = new Schema<NotificationsType>({
  otherUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  currentUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  notificationType: { type: String, required: true, enum: [NotificationType.Follow, NotificationType.Postlike] },
  isViewed: { type: Boolean, required: true, default: false },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export type PopulatedNotificationWithPost = Omit<NotificationsType, 'postId'> & { postId: Post };
export type PopulatedNotificationWithOtherUser = Omit<NotificationsType, 'otherUserId'> & { otherUserId: UserType };

export const notificationModel = models['notificationModel'] || model('notificationModel', NotificationsSchema);
