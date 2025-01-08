import Order from '../../../../src/models/order.model';
import { GraphQLResolveInfo } from 'graphql';
import { getOrder } from '../../../../src/resolvers/queries/order/get-order';
jest.mock('../../../../src/models/order.model', () => ({
  find: jest.fn(),
}));

describe('getOrder', () => {
  it('should get order', async () => {
    const mockOrders = [
      { _id: 'order1', createdAt: new Date(), payment: 'paid', userId: 'test-user-id' },
      { _id: 'order2', createdAt: new Date(), payment: 'paid', userId: 'test-user-id' },
    ];

    const mockSort = jest.fn().mockResolvedValueOnce(mockOrders);

    (Order.find as jest.Mock).mockReturnValueOnce({ sort: mockSort });

    const result = await getOrder!({}, {}, { userId: 'test-user-id' }, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockOrders);

    expect(Order.find).toHaveBeenCalledWith({ userId: 'test-user-id', payment: 'paid'});

    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getOrder!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
