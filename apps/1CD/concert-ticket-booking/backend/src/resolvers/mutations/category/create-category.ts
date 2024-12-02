import { MutationResolvers } from '../../../generated';
import Category from '../../../models/category.model';

export const createCategory: MutationResolvers['createCategory'] = async (_, { name }) => {
  const findCat = await Category.findOne({ name });
  if (findCat) {
    throw new Error('Already exist category name');
  }
  const createCat = await Category.create({
    name,
  });

  return createCat;
};
