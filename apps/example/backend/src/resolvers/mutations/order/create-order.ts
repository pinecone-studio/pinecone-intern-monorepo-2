import { MutationResolvers, Response } from '../../../generated';
import { orderModel } from '../../../models';

export const createOrder: MutationResolvers['createOrder'] = async (_, { products }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  await orderModel.create({
    user: userId,
    products,
  });

  return Response.Success;
};
