import { getAllCategory } from 'src/resolvers/queries/category/get-all-category';
import { Category } from 'src/models/category-model';

jest.mock('src/models/category-model', () => ({
  Category: {
    find: jest.fn().mockResolvedValue([
      { name: 'Italian', description: 'Italian cuisine' },
      { name: 'Chinese', description: 'Chinese cuisine' },
    ]),
  },
}));

describe('get all category mutation unit tests', () => {
  it('should be defined', () => {
    expect(getAllCategory).toBeDefined();
  });
  it('should return an array of categories', async () => {
    const result = await getAllCategory({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
  it('should throw an error if fetching categories fails', async () => {
    (Category.find as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    await expect(getAllCategory({})).rejects.toThrow('Error fetching categories: Database error');
  });
});