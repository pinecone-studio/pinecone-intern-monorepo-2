import { QueryResolvers } from '../../../generated';
import { categoryModel } from '../../../models';

export const getCategories: QueryResolvers['getCategories'] = async () => {
  const categories = await categoryModel.find();

  return categories;
};
