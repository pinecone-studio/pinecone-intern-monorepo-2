/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createPostLike } from '../../../../src/resolvers/mutations';
import { PostLikeModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  PostLikeModel: {
    create: jest.fn(),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    (PostLikeModel.create as jest.Mock).mockResolvedValue({ _id: '1', isLike: true });

    const result = await createPostLike!(
      {},
      {
        postId: 'PostId',
        isLike: true,
      },
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      isLike: true,
    });
  });

  it('Can not create post without userId', async () => {
    try {
      await createPostLike!(
        {},
        {
          postId: 'PostId',
          isLike: true,
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('Can not create post without isLike = false', async () => {
    try {
      await createPostLike!(
        {},
        {
          postId: 'PostId',
          isLike: false,
        },
        { userId: 'user1' },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Error create postlike'));
    }
  });
});
