import { createCategory } from 'src/resolvers/mutations/category/create-category';
import { Category } from 'src/models/category-model';

describe('createCategory Mutation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a new category successfully', async () => {
    const args = { name: 'Test Category' };

    jest.spyOn(Category.prototype, 'save').mockResolvedValue({
      _id: 'mocked-id',
      name: args.name,
    });

    const result = await createCategory({}, args);

    expect(result).toHaveProperty('_id', 'mocked-id');
    expect(result.name).toBe(args.name);
  });

  it('should handle database save error gracefully', async () => {
    const args = { name: 'Error Category' };

    jest.spyOn(Category.prototype, 'save').mockRejectedValue(new Error('Database failure'));

    await expect(createCategory({}, args)).rejects.toThrow('Error creating category: Database failure');
  });
});
