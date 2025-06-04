import { Order } from 'src/models/order-model';
export const getAllOrder = async (_: unknown) => {
  try {
    const orders = await Order.find({});
    return orders ?? [];
  } catch (err: any) {
    return [];
  }
};
