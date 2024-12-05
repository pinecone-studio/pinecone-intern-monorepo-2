import { getCategories } from '../../../../src/resolvers/queries/category-query/get-categories';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/category.model', () => ({
    find: jest.fn().mockResolvedValueOnce([
      {
        name:"test"
      }
    ])
}));
describe('getCategories', () => {
  it('should get categories', async () => {
    const response = await getCategories!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);
    console.log({response});
    expect(response).toEqual([{
      name:"test"
    }]);
  });

});