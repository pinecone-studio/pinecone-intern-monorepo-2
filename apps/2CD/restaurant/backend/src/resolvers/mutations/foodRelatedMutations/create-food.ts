import { Food } from 'src/models/food-model';

export const createFood = async (_: unknown, args: { name: string; price: number; description?: string; image?: string; category?: string }) => {
  const { name, price, description, image, category } = args;

  try {
    const food = new Food({
      name,
      price,
      description,
      image,
      category
    });
    const savedFood = await food.save();
    return savedFood;
  } catch (err: any) {
    throw new Error('Error creating food item: ' + err.message);
  }
};
