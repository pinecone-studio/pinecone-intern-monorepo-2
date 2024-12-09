import { MutationResolvers } from '../../../generated';
import Order from '../../../models/order.model';

export const changeReq: MutationResolvers['updateEvent'] = async (_, { _id, orderId }) => {
  const eventUpdated = await Order.findOneAndUpdate({ _id }, { $set: event }, { new: true });
  return eventUpdated;
};
