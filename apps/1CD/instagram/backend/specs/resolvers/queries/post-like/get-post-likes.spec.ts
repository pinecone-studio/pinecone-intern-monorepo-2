/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getPostLikes } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/post.model', () => ({
  PostLikeModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce([
          {
            _id: '11',
            post: 'post1',
            createdAt: 'date',
            user: {
              _id: 'user1',
              userName: 'Test',
            },
          },
          {
            _id: '12',
            post: 'post1',
            createdAt: 'date',
            user: {
              _id: 'user2',
              userName: 'Test',
            },
          },
        ]),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce(null),
      }),
  },
}));

describe('get  post likes', () => {
  it('should get  post likes', async () => {
    const response = await getPostLikes!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '11',
        post: 'post1',
        createdAt: 'date',
        user: {
          _id: 'user1',
          userName: 'Test',
        },
      },
      {
        _id: '12',
        post: 'post1',
        createdAt: 'date',
        user: {
          _id: 'user2',
          userName: 'Test',
        },
      },
    ]);
  });

  it('should not  get  post likes', async () => {
    // await expect(getPostLikes!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo)).rejects.toThrow('This post have not a like');
    const response = await getPostLikes!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual(null);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getPostLikes!({}, { postId: 'post1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
