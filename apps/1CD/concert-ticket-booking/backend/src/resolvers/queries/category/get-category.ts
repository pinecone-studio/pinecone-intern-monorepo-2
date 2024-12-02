import Category from '../../../models/category.model';
import { QueryResolvers } from '../../../generated';

export const getCategory: QueryResolvers['getCategory'] = async () => {
  const getCategory = await Category.find({});
  return getCategory;
};
