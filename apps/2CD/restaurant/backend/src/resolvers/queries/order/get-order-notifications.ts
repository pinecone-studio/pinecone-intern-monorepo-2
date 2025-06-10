import { OrderNotification } from 'src/models/order-notification.model';

export const getOrderNotifications = async ({ userId }: { userId: string }) => {
  try {
    const notifications = await OrderNotification.find({ userId }).sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    console.error('Notification авахад алдаа гарлаа:', error);
    throw new Error('Notification авахад алдаа гарлаа.');
  }
};
