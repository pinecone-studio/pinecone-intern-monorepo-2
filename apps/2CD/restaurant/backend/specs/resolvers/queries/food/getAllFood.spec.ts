import { Food } from 'src/models/food-model';
import { getAllFood } from 'src/resolvers/queries/food/get-all-food';

jest.mock('src/models/food-model', () => ({
  Food: {
    find: jest.fn().mockResolvedValue([
      { name: 'Pizza', price: 10 },
      { name: 'Burger', price: 8 },
    ]),
  },
}));

describe('get all food mutation unit tests', () => {
  it('should be defined', () => {
    expect(getAllFood).toBeDefined();
  });

  it('should return an array of food items', async () => {
    const result = await getAllFood({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('should throw an error if fetching food items fails', async () => {
    (Food.find as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    await expect(getAllFood({})).rejects.toThrow('Error fetching food items: Database error');
  });
});
