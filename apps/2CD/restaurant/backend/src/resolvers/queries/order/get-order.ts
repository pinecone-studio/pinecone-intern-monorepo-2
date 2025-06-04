import { Order } from 'src/models/order-model';
export const getOrder = async (_: unknown, args: { orderId: string }) => {
  try {
    const order = await Order.findById(args.orderId).populate('foodItems');
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (err: any) {
    throw new Error('Error fetching order: ' + err.message);
  }
};
