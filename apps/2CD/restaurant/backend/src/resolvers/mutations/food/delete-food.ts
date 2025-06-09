import { Food } from 'src/models/food-model';
export const deleteFood = async (_: unknown, args: { _id: string }) => {
  const { _id } = args;
  try {
    const deletedFood = await Food.findByIdAndDelete(_id);
    if (!deletedFood) {
      throw new Error('Food item not found');
    }
    return deletedFood;
  } catch (err: any) {
    throw new Error('Error deleting food item: ' + err.message);
  }
};
