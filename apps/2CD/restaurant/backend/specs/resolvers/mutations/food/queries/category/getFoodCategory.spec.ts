import { getFoodCategory } from 'src/resolvers/queries/category/get-food-category';
import { Food } from 'src/models/food-model';

jest.mock('src/models/food-model', () => ({
  Food: {
    find: jest.fn(),
  },
}));

describe('getFoodCategory', () => {
  const mockFoods = [{ name: 'Pizza' }, { name: 'Burger' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return foods found by Food.find', async () => {
    (Food.find as jest.Mock).mockResolvedValueOnce(mockFoods);

    const result = await getFoodCategory(null, { _id: '123' });
    expect(Food.find).toHaveBeenCalledWith({ category: '123' });
    expect(result).toEqual(mockFoods);
  });

  it('should throw error if Food.find fails', async () => {
    (Food.find as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

    await expect(getFoodCategory(null, { _id: '123' })).rejects.toThrow('Error fetching foods for category: DB failure');
  });
});