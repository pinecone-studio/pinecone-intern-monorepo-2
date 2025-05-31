import { Food } from 'src/models/food-model';

export const getFoodCategory = async (_: unknown, args: { _id: string }) => {
  try {
    const foods = await Food.find({ category: args._id });
    return foods;
  } catch (err: any) {
    throw new Error('Error fetching foods for category: ' + err.message);
  }
};
