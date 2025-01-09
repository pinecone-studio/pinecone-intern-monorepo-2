/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deletePost } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        user: 'user1',
      })
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({
        _id: '1',
        user: 'user2',
      }),
    findByIdAndDelete: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        user: 'user1',
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
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      user: 'user1',
    });
  });
  it('should not found post', async () => {
    try {
      await deletePost!(
        {},
        {
          _id: '1',
        },
        { userId: 'user1' },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Not found post'));
    }
  });
  it('should throw a post', async () => {
    try {
      await deletePost!(
        {},
        {
          _id: '1',
        },
        { userId: 'user1' },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Can not delete post'));
    }
  });
});
