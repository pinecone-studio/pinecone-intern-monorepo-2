import { getCategories } from '../../../../src/resolvers/queries/category/get-category';
import Category from '../../../../src/models/category.model';
import { GraphQLResolveInfo } from 'graphql';
jest.mock('../../../../src/models/category.model');

describe('getCategory Resolver', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should return a list of categories', async () => {
    // Mock data
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    // Mock the Category.find function
    (Category.find as jest.Mock).mockResolvedValueOnce(mockCategories);

    // Call the resolver
    const result = await getCategories!({}, { id: '123' }, { userId: null }, {} as GraphQLResolveInfo);

    // Assertions
    expect(Category.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockCategories);
  });

  it('should return an empty array if no categories are found', async () => {
    // Mock the Category.find function to return an empty array
    (Category.find as jest.Mock).mockResolvedValueOnce([]);

    // Call the resolver
    const result = await getCategories!({}, { id: '123' }, { userId: null }, {} as GraphQLResolveInfo);

    // Assertions
    expect(Category.find).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });

  it('should throw an error if there is an issue with the database', async () => {
    // Mock the Category.find function to throw an error
    const mockError = new Error('Database error');
    (Category.find as jest.Mock).mockRejectedValueOnce(mockError);

    // Call the resolver and expect an error
    await expect(getCategories!({}, { id: '123' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Database error');

    // Assertions
    expect(Category.find).toHaveBeenCalledWith({});
  });
});
