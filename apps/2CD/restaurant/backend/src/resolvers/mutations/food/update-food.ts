import { Food } from 'src/models/food-model';

type UpdateFood = {
  _id: string;
  name?: string;
  price?: number;
  description?: string;
  image?: string;
};

export const updateFood = async (_: unknown, { input }: { input: UpdateFood }) => {
  const { _id, ...updateData } = input;

  try {
    const updatedFood = await Food.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!updatedFood) {
      throw new Error('Food item not found');
    }

    return updatedFood;
  } catch (err: any) {
    throw new Error('Error updating food item: ' + err.message);
  }
};
