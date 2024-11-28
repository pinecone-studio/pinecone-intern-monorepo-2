import { MutationResolvers } from '../../../generated';
import Category from '../../../models/category.model';

export const createCategory: MutationResolvers['createCategory'] = async (_, { name }) => {
  const createCat = await Category.create({
    name,
  });

  console.log({ createCategory });

  return createCat;
};
