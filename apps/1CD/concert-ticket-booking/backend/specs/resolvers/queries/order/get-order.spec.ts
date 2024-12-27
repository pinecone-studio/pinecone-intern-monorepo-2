import Order from '../../../../src/models/order.model';
import { GraphQLResolveInfo } from 'graphql';
import { getOrder } from '../../../../src/resolvers/queries/order/get-order';
jest.mock('../../../../src/models/order.model', () => ({
  find: jest.fn(),
}));

describe('getOrder', () => {
  it('should get order', async () => {
    (Order.find as jest.Mock).mockResolvedValueOnce([]);
    const result = await getOrder!({}, {}, { userId: 'test-user-id' }, {} as GraphQLResolveInfo);
    expect(result).toEqual([]);
    expect(Order.find).toHaveBeenCalledWith({ userId: 'test-user-id' });
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getOrder!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
