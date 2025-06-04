import { allNotificationQuery } from 'src/resolvers/queries';
import { allNotification } from 'src/models/all-notification.model';

jest.mock('src/models/all-notification.model', () => ({
  allNotification: {
    find: jest.fn(),
  },
}));

describe('allNotificationQuery', () => {
  const mockUserId = '6650f39bb2f86d80d9bc7a02';

  it('should return notifications for a user', async () => {
    const mockNotifications = [
      {
        _id: '1',
        userId: mockUserId,
        orderNumber: '12345',
        message: 'Your order is confirmed.',
        status: 'Хүлээгдэж буй',
        createdAt: new Date(),
      },
    ];

    (allNotification.find as jest.Mock).mockResolvedValue(mockNotifications);

    const result = await allNotificationQuery(undefined, { userId: mockUserId });

    expect(allNotification.find).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result).toEqual(mockNotifications);
  });

  it('should return an empty array if no notifications exist', async () => {
    (allNotification.find as jest.Mock).mockResolvedValue([]);

    const result = await allNotificationQuery(undefined, { userId: mockUserId });

    expect(allNotification.find).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result).toEqual([]);
  });

  it('should throw error if find fails', async () => {
    (allNotification.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(allNotificationQuery(undefined, { userId: mockUserId })).rejects.toThrow('DB error');
  });
});
