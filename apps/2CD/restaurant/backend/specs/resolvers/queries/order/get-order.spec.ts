import { getOrder } from 'src/resolvers/queries/order/get-order';
import { Order } from 'src/models/order-model';

jest.mock('src/models/order-model', () => ({
  Order: {
    findById: jest.fn(),
  },
}));

describe('getOrder', () => {
  const mockPopulate = jest.fn();
  const mockOrder = { _id: 'order1', foodItems: [] };

  beforeEach(() => {
    jest.clearAllMocks();
    (Order.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });
  });

  it('should return the order if found', async () => {
    mockPopulate.mockResolvedValue(mockOrder);

    const result = await getOrder(undefined, { orderId: 'order1' });
    expect(Order.findById).toHaveBeenCalledWith('order1');
    expect(mockPopulate).toHaveBeenCalledWith('foodItems');
    expect(result).toBe(mockOrder);
  });

  it('should throw if order not found', async () => {
    mockPopulate.mockResolvedValue(null);

    await expect(getOrder(undefined, { orderId: 'order1' })).rejects.toThrow('Order not found');
  });

  it('should throw if db error occurs', async () => {
    mockPopulate.mockRejectedValue(new Error('db failed'));

    await expect(getOrder(undefined, { orderId: 'order1' })).rejects.toThrow('Error fetching order: db failed');
  });
});
