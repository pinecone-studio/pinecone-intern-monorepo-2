import { Category } from 'src/models/category-model';


export const createCategory = async (
  _: unknown,
  args: { name: string }
) => {
  const { name } = args;

  try {
    const category = new Category({ name });
    const savedCategory = await category.save();
    return savedCategory;
  } catch (err: any) {
    throw new Error('Error creating category: ' + err.message);
  }
};
