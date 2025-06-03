// tests/order-service.test.ts
import { getAllOrder } from 'src/resolvers/queries/order/get-all-order';
import { Order } from 'src/models/order-model';

// Mock the Order model
jest.mock('src/models/order-model', () => ({
  Order: {
    find: jest.fn(),
  },
}));

describe('getAllOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return orders when Order.find succeeds', async () => {
    const mockOrders = [{ id: 1 }, { id: 2 }];
    (Order.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getAllOrder(undefined);

    expect(Order.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockOrders);
  });

  it('should return an empty array when Order.find returns undefined', async () => {
    (Order.find as jest.Mock).mockResolvedValue(undefined);

    const result = await getAllOrder(undefined);

    expect(Order.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return an empty array when Order.find throws an error', async () => {
    (Order.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await getAllOrder(undefined);

    expect(Order.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
