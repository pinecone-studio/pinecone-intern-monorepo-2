/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createCommentLike } from '../../../../src/resolvers/mutations';
import { commentLikeModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  commentLikeModel: {
    create: jest.fn(),
  },
}));

describe('Create comment like', () => {
  it('should create a  comment like', async () => {
    const mock = {
      _id: '1',
      isLike: true,
    };

    (commentLikeModel.create as jest.Mock).mockResolvedValueOnce(mock);

    const result = await createCommentLike!(
      {},
      {
        commentId: 'Comment1',
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

  it('Can not create  comment like without userId', async () => {
    try {
      await createCommentLike!(
        {},
        {
          commentId: 'Comment1',
          isLike: true,
        },
        { userId: null },
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('Can not create  comment like without isLike = false', async () => {
    try {
      await createCommentLike!(
        {},
        {
          commentId: 'Comment1',
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
