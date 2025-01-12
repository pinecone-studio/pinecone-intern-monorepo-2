import { MutationResolvers, Response } from '../../../generated';
import { saveModel } from '../../../models';

export const toggleSaveProduct: MutationResolvers['toggleSaveProduct'] = async (_, { productId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const save = await saveModel.findOne({
    product: productId,
    user: userId,
  });

  if (save) {
    await saveModel.deleteOne({ _id: save._id });
  } else {
    await saveModel.create({
      product: productId,
      user: userId,
    });
  }

  return Response.Success;
};
