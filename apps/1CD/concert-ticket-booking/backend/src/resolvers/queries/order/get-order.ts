import { QueryResolvers } from '../../../generated';
import Order from '../../../models/order.model';
export const getOrder: QueryResolvers['getOrder'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const getOrder = await Order.find({ userId, payment: 'paid' }).sort({ createdAt: -1 });
  return getOrder;
};
