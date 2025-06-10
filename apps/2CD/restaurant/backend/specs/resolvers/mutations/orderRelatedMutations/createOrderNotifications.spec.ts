import { createOrderNotification } from 'src/resolvers/mutations';
import { OrderNotification } from 'src/models/order-notification.model';

jest.mock('src/models/order-notification.model', () => ({
  OrderNotification: {
    create: jest.fn(),
  },
}));

const mockOrderNotification = OrderNotification as jest.Mocked<typeof OrderNotification>;

describe('createOrderNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const commonArgs = {
    orderId: 'order123',
    userId: 'user456',
    orderNumber: 789,
  };

  it('should create notification with "Хүлээгдэж буй" status', async () => {
    const input = { ...commonArgs, status: 'Хүлээгдэж буй' as const };
    const expectedMessage = `Захиалга #${input.orderNumber} - Хүлээгдэж байна.`;

    const mockNotification = {
      orderId: input.orderId,
      userId: input.userId,
      message: expectedMessage,
      seen: false,
      createdAt: new Date(),
    };

    mockOrderNotification.create.mockResolvedValue(mockNotification as any);

    const result = await createOrderNotification(null, input);

    expect(mockOrderNotification.create).toHaveBeenCalledWith({
      orderId: input.orderId,
      userId: input.userId,
      message: expectedMessage,
      seen: false,
      createdAt: expect.any(Date),
    });
    expect(result).toEqual(mockNotification);
  });

  it('should create notification with "Бэлтгэгдэж буй" status', async () => {
    const input = { ...commonArgs, status: 'Бэлтгэгдэж буй' as const };
    const expectedMessage = `Захиалга #${input.orderNumber} - Бэлтгэгдэж байна.`;

    mockOrderNotification.create.mockResolvedValue({
      orderId: input.orderId,
      userId: input.userId,
      message: expectedMessage,
      seen: false,
      createdAt: new Date(),
    } as any);

    const result = await createOrderNotification(null, input);

    expect(mockOrderNotification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
      })
    );
    expect(result.message).toBe(expectedMessage);
  });

  it('should create notification with "Амжилттай" status', async () => {
    const input = { ...commonArgs, status: 'Амжилттай' as const };
    const expectedMessage = `Захиалга #${input.orderNumber} - Амжилттай.`;

    mockOrderNotification.create.mockResolvedValue({
      orderId: input.orderId,
      userId: input.userId,
      message: expectedMessage,
      seen: false,
      createdAt: new Date(),
    } as any);

    const result = await createOrderNotification(null, input);

    expect(mockOrderNotification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
      })
    );
    expect(result.message).toBe(expectedMessage);
  });

  it('should log error and throw if create fails', async () => {
    const input = { ...commonArgs, status: 'Хүлээгдэж буй' as const };
    const error = new Error('DB error');
    mockOrderNotification.create.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error');

    await expect(createOrderNotification(null, input)).rejects.toThrow('Notification үүсгэж чадсангүй.');

    expect(consoleSpy).toHaveBeenCalledWith('Notification үүсгэхэд алдаа гарлаа:', error);
  });
});
