/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getPostByPostId } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/post.model', () => ({
  PostModel: {
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        _id: '12',
        description: 'Post 1',
        images: ['img1'],
        lastComments: 'String',
        user: {
          _id: 'user1',
        },
        commentCount: 1,
        likeCount: 1,
        updatedAt: 'date',
        createdAt: '2024-12-21T06:11:30.947Z',
      }),
    }),
  },
}));

describe('get my posts', () => {
  it('should throw an error when userId is not provided', async () => {
    await expect(getPostByPostId!({}, { postId: '12' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should get my posts', async () => {
    const response = await getPostByPostId!({}, { postId: '12' }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      description: 'Post 1',
      images: ['img1'],
      lastComments: 'String',
      user: {
        _id: 'user1',
      },
      commentCount: 1,
      likeCount: 1,
      updatedAt: 'date',
      createdAt: '2024-12-21T06:11:30.947Z',
    });
  });
});
