import { createCategory } from '../../../../src/resolvers/mutations/category/create-category'; // createCategory mutation
import Category from '../../../../src/models/category.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/category.model');

describe('createCategory Mutation', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create a category and return the created category', async () => {
    // Mock findOne to return null (no existing category)
    (Category.findOne as jest.Mock).mockResolvedValueOnce(null);

    // Mock create to return the new category
    const mockCategory = { id: '123', name: 'Test Category' };
    (Category.create as jest.Mock).mockResolvedValueOnce(mockCategory);

    // Call the mutation
    const result = await createCategory!({}, { name: 'Test Category' }, { userId: null }, {} as GraphQLResolveInfo);

    // Assertions

    expect(result).toEqual(mockCategory);
  });

  it('should throw an error if the category name already exists', async () => {
    // Mock findOne to return an existing category
    (Category.findOne as jest.Mock).mockResolvedValueOnce({ id: '456', name: 'Test Category' });

    // Call the mutation and expect an error
    await expect(createCategory!({}, { name: 'Test Category' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Already exist category name');

    // Assertions
    expect(Category.findOne).toHaveBeenCalledWith({ name: 'Test Category' });
    expect(Category.create).not.toHaveBeenCalled(); // Ensure create is not called
  });
});
