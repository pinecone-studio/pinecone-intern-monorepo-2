/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deletePostLike } from '../../../../src/resolvers/mutations';
import { PostLikeModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  PostLikeModel: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    (PostLikeModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1', isLike: true });

    const result = await deletePostLike!(
      {},
      {
        postLikeId: '1',
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
      await deletePostLike!(
        {},
        {
          postLikeId: '2',
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
});
