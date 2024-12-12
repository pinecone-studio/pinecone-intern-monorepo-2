import Category from '../../../models/category.model';
import { QueryResolvers } from '../../../generated';

export const getCategories: QueryResolvers['getCategories'] = async () => {
  const getCategories = await Category.find({});
  return getCategories;
};
