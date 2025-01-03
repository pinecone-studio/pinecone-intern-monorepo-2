/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { createPostLike } from '../../../../src/resolvers/mutations';
import { notificationModel, PostLikeModel, PostModel } from '../../../../src/models';
import { NotificationType } from 'src/generated';

jest.mock('../../../../src/models', () => ({
  PostLikeModel: {
    create: jest.fn(),
  },
  PostModel: { findOne: jest.fn() },
  notificationModel: { create: jest.fn() },
}));

describe('Create Post', () => {
  it('should create a post', async () => {
    const findedPost = { Id: 'PodtId', user: 'user1', description: 'Mocked post', images: 'http://www.example.com/image1.jpg', lastComments: 'Mocked Comment' };
    (PostLikeModel.create as jest.Mock).mockResolvedValue({ _id: '1', isLike: true });
    (PostModel.findOne as jest.Mock).mockResolvedValueOnce(findedPost);
    (notificationModel.create as jest.Mock).mockResolvedValue({ otherUserId: 'user1', postId: 'PostId', notificationType: NotificationType.Postlike, currentUserId: findedPost.user });

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
