import { QueryResolvers } from 'src/generated';
import { notificationModel, PopulatedNotificationWithCurrentUser, PopulatedNotificationWithPost } from 'src/models';

export const getNotificationsByLoggedUser: QueryResolvers['getNotificationsByLoggedUser'] = async (_: unknown, __, { userId }) => {
  if (!userId) throw new Error('wrong in authorization');

  const notifications = await notificationModel.find({ currentUserId: userId }).populate<PopulatedNotificationWithPost>('postId').populate<PopulatedNotificationWithCurrentUser>('currentUserId');

  return notifications.map((notification) => notification.toObject());
};
