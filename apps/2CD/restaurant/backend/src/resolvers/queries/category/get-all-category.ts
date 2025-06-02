import { Category } from 'src/models/category-model';

export const getAllCategory = async (_: unknown) => {
  try {
    const categories = await Category.find({});
    return categories;
  } catch (err: any) {
    throw new Error('Error fetching categories: ' + err.message);
  }
};