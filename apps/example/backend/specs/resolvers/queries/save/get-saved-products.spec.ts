import { GraphQLResolveInfo } from 'graphql';
import { getSavedProducts } from '../../../../src/resolvers/queries/save/get-saved-products';

jest.mock('../../../../src/models', () => ({
  saveModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue([]),
    }),
  },
}));

describe('getSavedProducts', () => {
  it('should throw authorization error', async () => {
    try {
      await getSavedProducts!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('should get saved products', async () => {
    const response = await getSavedProducts!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([]);
  });
});
