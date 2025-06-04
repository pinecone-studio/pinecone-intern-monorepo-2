import { allNotification } from 'src/models/all-notification.model';

export const allNotificationQuery = async (_: unknown, arg: { userId: string }) => {
  const { userId } = arg;
  const notification = await allNotification.find({ userId });
  return notification;
};
