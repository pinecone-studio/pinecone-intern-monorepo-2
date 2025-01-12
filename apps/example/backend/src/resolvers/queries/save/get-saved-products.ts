import { QueryResolvers } from '../../../generated';
import { saveModel, SavePopulatedType } from '../../../models';

export const getSavedProducts: QueryResolvers['getSavedProducts'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const savedProducts = await saveModel
    .find({
      user: userId,
    })
    .populate<SavePopulatedType>('product');

  return savedProducts;
};
