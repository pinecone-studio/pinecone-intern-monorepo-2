import { getUserOrder } from 'src/resolvers/queries';
import { Order } from '../../../../src/models/order-model';

jest.mock('../../../../src/models/order-model');

describe('getUserOrder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return transformed orders with foodItems foodId as string', async () => {
    const mockOrders = [
      {
        toObject: () => ({
          _id: 'order1',
          buyerId: 'user123',
          foodItems: [
            { foodId: 'food1', quantity: 2 },
            { foodId: 'food2', quantity: 3 },
          ],
        }),
        foodItems: [
          { foodId: { toString: () => 'food1' }, quantity: 2 },
          { foodId: { toString: () => 'food2' }, quantity: 3 },
        ],
      },
    ];

    (Order.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getUserOrder(null, { userId: 'user123' });

    expect(Order.find).toHaveBeenCalledWith({ buyerId: 'user123' });
    expect(result).toEqual([
      {
        _id: 'order1',
        buyerId: 'user123',
        foodItems: [
          { foodId: 'food1', quantity: 2 },
          { foodId: 'food2', quantity: 3 },
        ],
      },
    ]);
  });

  it('should return empty array when no orders found', async () => {
    (Order.find as jest.Mock).mockResolvedValue([]);

    const result = await getUserOrder(null, { userId: 'no-user' });

    expect(Order.find).toHaveBeenCalledWith({ buyerId: 'no-user' });
    expect(result).toEqual([]);
  });

  it('should handle orders with empty foodItems array', async () => {
    const mockOrders = [
      {
        toObject: () => ({
          _id: 'order2',
          buyerId: 'user456',
          foodItems: [],
        }),
        foodItems: [],
      },
    ];

    (Order.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getUserOrder(null, { userId: 'user456' });

    expect(result).toEqual([
      {
        _id: 'order2',
        buyerId: 'user456',
        foodItems: [],
      },
    ]);
  });

  it('should handle foodId as a string directly without toString()', async () => {
    const mockOrders = [
      {
        toObject: () => ({
          _id: 'order3',
          buyerId: 'user789',
          foodItems: [{ foodId: 'directStringId', quantity: 5 }],
        }),
        foodItems: [
          { foodId: 'directStringId', quantity: 5 }, // no toString method here
        ],
      },
    ];

    (Order.find as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getUserOrder(null, { userId: 'user789' });

    expect(result).toEqual([
      {
        _id: 'order3',
        buyerId: 'user789',
        foodItems: [{ foodId: 'directStringId', quantity: 5 }],
      },
    ]);
  });
});
