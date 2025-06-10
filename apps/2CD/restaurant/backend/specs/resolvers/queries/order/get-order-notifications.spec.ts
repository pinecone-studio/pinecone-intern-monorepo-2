import { getOrderNotifications } from 'src/resolvers/queries';
import { OrderNotification } from 'src/models/order-notification.model';

jest.mock('src/models/order-notification.model', () => ({
  OrderNotification: {
    find: jest.fn(() => ({ sort: jest.fn() })),
  },
}));

const mockOrderNotification = OrderNotification as jest.Mocked<typeof OrderNotification>;

describe('getOrderNotifications', () => {
  const userId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return notifications sorted by createdAt in descending order', async () => {
    const mockNotifications = [
      { _id: '1', userId, message: 'Notification 1', createdAt: new Date() },
      { _id: '2', userId, message: 'Notification 2', createdAt: new Date() },
    ];

    const sortMock = jest.fn().mockResolvedValue(mockNotifications);
    mockOrderNotification.find.mockReturnValue({ sort: sortMock } as any);

    const result = await getOrderNotifications({ userId });

    expect(mockOrderNotification.find).toHaveBeenCalledWith({ userId });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockNotifications);
  });

  it('should log and throw error when OrderNotification.find fails', async () => {
    const error = new Error('DB error');
    const consoleSpy = jest.spyOn(console, 'error');

    mockOrderNotification.find.mockImplementation(() => {
      throw error;
    });

    await expect(getOrderNotifications({ userId })).rejects.toThrow('Notification авахад алдаа гарлаа.');
    expect(consoleSpy).toHaveBeenCalledWith('Notification авахад алдаа гарлаа:', error);
  });
});
