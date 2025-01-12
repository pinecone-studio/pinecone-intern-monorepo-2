import { GraphQLResolveInfo } from 'graphql';
import { createOrder } from '../../../../src/resolvers/mutations/order/create-order';

const products = [
  {
    product: '1',
    quantity: 1,
    priceWhenOrdered: 1,
  },
];

jest.mock('../../../../src/models', () => ({
  orderModel: {
    create: jest.fn().mockResolvedValue({}),
  },
}));

describe('createOrder', () => {
  it('should throw authorization error', async () => {
    try {
      await createOrder!({}, { products }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('should create an order', async () => {
    const response = await createOrder!({}, { products }, { userId: 'id' }, {} as GraphQLResolveInfo);

    expect(response).toBe('Success');
  });
});
