import { MutationResolvers } from '../../../generated';
import Order from '../../../models/order.model';

export const deleteOrder: MutationResolvers['deleteOrder'] = async (_, { _id }) => {
  const removeOrder = await Order.findOneAndDelete({ _id });
  if (!removeOrder) {
    throw new Error('Order not found');
  }
  return removeOrder;
};
