import { Food } from 'src/models/food-model';

export const getAllFood = async (_: unknown) => {
  try {
    const foods = await Food.find({});
    return foods;
  } catch (err: any) {
    throw new Error('Error fetching food items: ' + err.message);
  }
};
