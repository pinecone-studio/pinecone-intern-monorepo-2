import { GraphQLResolveInfo } from 'graphql';
import { getCategories } from '../../../../src/resolvers/queries/category/get-categories';

jest.mock('../../../../src/models', () => ({
  categoryModel: {
    find: jest.fn().mockResolvedValue([]),
  },
}));

describe('getCategories', () => {
  it('should get categories', async () => {
    const response = await getCategories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([]);
  });
});
