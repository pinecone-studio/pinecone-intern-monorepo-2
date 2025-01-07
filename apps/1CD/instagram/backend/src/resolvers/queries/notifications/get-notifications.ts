import { QueryResolvers } from 'src/generated';
import { notificationModel, PopulatedNotificationWithOtherUser, PopulatedNotificationWithPost } from 'src/models';

export const getNotificationsByLoggedUser: QueryResolvers['getNotificationsByLoggedUser'] = async (_: unknown, __, { userId }) => {
  if (!userId) throw new Error('wrong in authorization');

  const notifications = await notificationModel.find({ currentUserId: userId }).populate<PopulatedNotificationWithPost>('postId').populate<PopulatedNotificationWithOtherUser>('otherUserId');
  // console.log('notify iig harah', notifications);
  // console.log(
  //   'notify iig harah 111',
  //   notifications.map((notify) => notify.toObject())
  // );
  return notifications.map((notification) => notification.toObject());
};
