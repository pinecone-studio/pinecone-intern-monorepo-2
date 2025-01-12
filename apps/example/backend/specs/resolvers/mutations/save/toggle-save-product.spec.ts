import { GraphQLResolveInfo } from 'graphql';
import { toggleSaveProduct } from '../../../../src/resolvers/mutations/save/toggle-save-product';
import { Response } from '../../../../src/generated';

jest.mock('../../../../src/models', () => ({
  saveModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1' }),
    create: jest.fn().mockResolvedValue({ _id: '1' }),
    deleteOne: jest.fn().mockResolvedValue({ _id: '1' }),
  },
}));

describe('toggleSaveProduct', () => {
  it('should throw authorization error', async () => {
    try {
      await toggleSaveProduct!({}, { productId: '1' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('should save product', async () => {
    const response = await toggleSaveProduct!({}, { productId: '1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual(Response.Success);
  });

  it('should unsave product', async () => {
    const response = await toggleSaveProduct!({}, { productId: '1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual(Response.Success);
  });
});
