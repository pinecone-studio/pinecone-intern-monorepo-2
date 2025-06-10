import { OrderNotification } from 'src/models/order-notification.model';

export const createOrderNotification = async (
  _: unknown,
  {
    orderId,
    userId,
    orderNumber,
    status,
  }: {
    orderId: string;
    userId: string;
    orderNumber: number;
    status: 'Хүлээгдэж буй' | 'Бэлтгэгдэж буй' | 'Амжилттай';
  }
) => {
  const statusMessages = {
    'Хүлээгдэж буй': `Захиалга #${orderNumber} - Хүлээгдэж байна.`,
    'Бэлтгэгдэж буй': `Захиалга #${orderNumber} - Бэлтгэгдэж байна.`,
    Амжилттай: `Захиалга #${orderNumber} - Амжилттай.`,
  };

  try {
    const newNotification = await OrderNotification.create({
      orderId,
      userId,
      message: statusMessages[status],
      seen: false,
      createdAt: new Date(),
    });

    return newNotification;
  } catch (error) {
    console.error('Notification үүсгэхэд алдаа гарлаа:', error);
    throw new Error('Notification үүсгэж чадсангүй.');
  }
};
