/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { deleteCommentLike } from '../../../../src/resolvers/mutations';
import { commentLikeModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  commentLikeModel: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    (commentLikeModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1', isLike: true, likedUser: 'user1' });

    const result = await deleteCommentLike!(
      {},
      {
        commentLikeId: '1',
      },
      { userId: 'user1' },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({ _id: '1', isLike: true, likedUser: 'user1' });
  });

  it('Can not create post without userId', async () => {
    try {
      await deleteCommentLike!(
        {},
        {
          commentLikeId: '2',
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
});
