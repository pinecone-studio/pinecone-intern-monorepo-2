import { MutationResolvers } from '../../../generated';
import Order from '../../../models/order.model';

export const paymentCheck: MutationResolvers['paymentCheck'] = async (_, { orderId }) => {
  const findOrder = await Order.findById(orderId);
  if (!findOrder) {
    throw new Error('Order not found');
  }
  return {
    message: findOrder.payment === 'paid' ? 'paid' : 'pending',
  };
};
