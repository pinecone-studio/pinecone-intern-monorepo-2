import { model, models, Schema, Types } from 'mongoose';
import { UserType } from './user.model';
import { Post } from './post.model';

export type NotificationsType = {
  _id: string;
  otherUserId: Types.ObjectId;
  currentUserId: Types.ObjectId;
  notificationType: string;
  postId: Types.ObjectId;
  createdAt: Date;
};
const NotificationsSchema = new Schema<NotificationsType>({
  otherUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  currentUserId: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  notificationType: { type: String, required: true, enum: ['follow', 'postLike'] },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export type PopulatedNotificationWithPost = Omit<NotificationsType, 'postId'> & { postId: Post };
export type PopulatedNotificationWithCurrentUser = Omit<NotificationsType, 'currentUserId'> & { currentUserId: UserType };

export const notificationModel = models['notificationModel'] || model('notificationModel', NotificationsSchema);
