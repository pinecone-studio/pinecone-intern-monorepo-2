import { GraphQLResolveInfo } from 'graphql';
import { getProducts } from '../../../../src/resolvers/queries/product/get-products';

jest.mock('../../../../src/models', () => ({
  productModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    }),
  },
}));

describe('getProducts', () => {
  it('should get products', async () => {
    const response = await getProducts!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([]);
  });
});
