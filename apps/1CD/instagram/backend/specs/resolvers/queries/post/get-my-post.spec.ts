/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getMyPosts } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/post.model', () => ({
  PostModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue([
        {
          _id: '12',
          description: 'Post 1',
          images: ['img1'],
          lastComments: 'String',
          commentCount: 1,
          likeCount: 1,
          updatedAt: 'date',
          createdAt: 'date',
        },
      ]),
    }),
  },
}));

describe('get my post', () => {
  it('should throw an error when userId is not provided', async () => {
    await expect(getMyPosts!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should get my posts', async () => {
    const response = await getMyPosts!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',

        description: 'Post 1',
        images: ['img1'],
        lastComments: 'String',
        commentCount: 1,
        likeCount: 1,
        updatedAt: 'date',
        createdAt: 'date',
      },
    ]);
  });
});
