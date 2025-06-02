import { Food } from "src/models/food-model";
export const deleteFood = async (_: unknown, args: { id: string }) => {
  const { id } = args;
  try {
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      throw new Error('Food item not found');
    }
    return deletedFood;
  } catch (err: any) {
    throw new Error('Error deleting food item: ' + err.message);
  }
}