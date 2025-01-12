import { GraphQLResolveInfo } from 'graphql';
import { getProductById } from '../../../../src/resolvers/queries/product/get-product-by-id';

jest.mock('../../../../src/models', () => ({
  productModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({
          _id: '1',
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(null),
      }),
  },
}));

describe('getProductById', () => {
  it('should get product by id', async () => {
    const response = await getProductById!({}, { _id: '1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '1',
    });
  });

  it('should not get product by id', async () => {
    try {
      await getProductById!({}, { _id: '1' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Product not found'));
    }
  });
});
