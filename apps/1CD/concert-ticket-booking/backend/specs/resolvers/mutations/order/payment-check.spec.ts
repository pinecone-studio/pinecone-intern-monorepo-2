import { paymentCheck } from '../../../../src/resolvers/mutations/order/payment-check';
import Order from '../../../../src/models/order.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/order.model', () => ({
  findById: jest.fn(),
}));

describe('paymentCheck mutation', () => {
  it('should return "paid" if the order has a "paid" payment status', async () => {
    const mockOrder = {
      _id: 'orderid12345',
      payment: 'paid',
    };
    (Order.findById as jest.Mock).mockResolvedValueOnce(mockOrder);
    const result = await paymentCheck!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({ message: 'paid' });
  });

  it('should return "pending" if the order has a "pending" payment status', async () => {
    const mockOrder = {
      _id: 'orderid12345',
      payment: 'pending',
    };

    (Order.findById as jest.Mock).mockResolvedValueOnce(mockOrder);

    const result = await paymentCheck!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'pending' });
  });

  it('should throw an error if the order is not found', async () => {
    (Order.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(paymentCheck!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Order not found');
  });
});
