/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deletePost } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    findByIdAndDelete: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    const result = await deletePost!(
      {},
      {
        _id: '1',
      },
      {},
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
    });
  });
  it('should throw a post', async () => {
    try {
      await deletePost!(
        {},
        {
          _id: '1',
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not delete post'));
    }
  });
});
