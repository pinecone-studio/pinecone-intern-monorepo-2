import { createCategory } from '../../../../src/resolvers/mutations/category/create-category'; // createCategory мутацийн файл
import Category from '../../../../src/models/category.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/category.model');

describe('createCategory Mutation', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Mock-уудыг шинэчлэх
  });

  test('should create a category and return the created category', async () => {
    // Mock өгөгдөл
    const mockCategory = { id: '123', name: 'Test Category' };

    // Mock-ийг тохируулах
    (Category.create as jest.Mock).mockResolvedValue(mockCategory);

    const result = await createCategory!({}, { name: 'Test Category' }, { userId: null }, {} as GraphQLResolveInfo);

    // Тест
    expect(Category.create).toHaveBeenCalledWith({ name: 'Test Category' });
    expect(result).toEqual(mockCategory);
  });

  test('should throw an error if category creation fails', async () => {
    // Mock-ийг алдаа шидэхээр тохируулах
    (Category.create as jest.Mock).mockRejectedValue(new Error('Database Error'));

    await expect(createCategory!({}, { name: 'Test Category' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Database Error');
    expect(Category.create).toHaveBeenCalledWith({ name: 'Test Category' });
  });
});
