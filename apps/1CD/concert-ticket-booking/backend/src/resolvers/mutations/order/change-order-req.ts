import { MutationResolvers } from '../../../generated';
import Order from '../../../models/order.model';
import Request from '../../../models/request.model';

export const changeStatus: MutationResolvers['changeStatus'] = async (_, { input }) => {
  const { orderId, requestId } = input;

  try {
    const orderUpdate = await Order.findOneAndUpdate({ _id: orderId }, { status: 'approved' }, { new: true });

    if (!orderUpdate) {
      throw new Error('Order not found');
    }

    const requestUpdate = await Request.findOneAndUpdate({ _id: requestId }, { status: 'done' }, { new: true });

    if (!requestUpdate) {
      throw new Error('Request not found');
    }

    return { message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'error' };
  }
};
