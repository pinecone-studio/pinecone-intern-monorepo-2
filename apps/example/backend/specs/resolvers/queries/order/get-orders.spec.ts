import { GraphQLResolveInfo } from 'graphql';
import { getOrders } from '../../../../src/resolvers/queries/order';

jest.mock('../../../../src/models', () => ({
  orderModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: '1',
      }),
    }),
  },
}));

describe('getOrders', () => {
  it('should throw authorization error', async () => {
    try {
      await getOrders!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
  it('should get orders', async () => {
    const response = await getOrders!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '1',
    });
  });
});
