import { Order } from '../../../models/order-model';

export const getUserOrder = async (_: any, { userId }: { userId: string }) => {
  const orders = await Order.find({ buyerId: userId });
  return orders.map((order) => ({
    ...order.toObject(),
    foodItems: order.foodItems.map((item: { foodId: any; quantity: number }) => ({
      foodId: item.foodId.toString(), 
      quantity: item.quantity,
    })),
  }));
};
