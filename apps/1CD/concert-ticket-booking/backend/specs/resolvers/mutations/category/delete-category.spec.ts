import { deleteCategory } from '../../../../src/resolvers/mutations/category/delete-category';
import Category from '../../../../src/models/category.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/category.model');

describe('deleteCategory', () => {
  it('should delete a category and return it', async () => {
    const mockCategory = { _id: '123', name: 'Test Category' };
    (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCategory);

    const result = await deleteCategory!({}, { id: '123' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockCategory);
    expect(Category.findByIdAndDelete).toHaveBeenCalledWith('123');
  });

  it('should throw an error if category not found', async () => {
    (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deleteCategory!({}, { id: '123' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Category not found');
    expect(Category.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});
