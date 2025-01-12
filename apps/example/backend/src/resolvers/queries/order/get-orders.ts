import { QueryResolvers } from '../../../generated';
import { orderModel, OrderPopulatedType } from '../../../models';

export const getOrders: QueryResolvers['getOrders'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const orders = await orderModel
    .find({
      user: userId,
    })
    .populate<OrderPopulatedType>(['user', 'products.product']);

  return orders;
};
