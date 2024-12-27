/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getPostLike } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/post.model', () => ({
  PostLikeModel: {
    findOne: jest
      .fn()
      .mockReturnValueOnce({
        _id: '12',
        user: 'user1',
        post: 'post1',
        createdAt: 'date',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('get  post likes', () => {
  it('should get  post like', async () => {
    const response = await getPostLike!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      user: 'user1',
      post: 'post1',

      createdAt: 'date',
    });
  });

  it('should not  get  post like', async () => {
    // await expect(getPostLike!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo)).rejects.toThrow('This post not like you');
    const response = await getPostLike!({}, { postId: 'post1' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual(undefined);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getPostLike!({}, { postId: 'post1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
