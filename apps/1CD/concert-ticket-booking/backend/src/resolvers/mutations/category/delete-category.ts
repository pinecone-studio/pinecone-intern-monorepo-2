import { MutationResolvers } from '../../../generated';
import Category from '../../../models/category.model';

export const deleteCategory: MutationResolvers['deleteCategory'] = async (_, { id }) => {
  const deleteCat = await Category.findByIdAndDelete(id);
  if (!deleteCat) {
    throw new Error('Category not found');
  }



  return deleteCat;
};
