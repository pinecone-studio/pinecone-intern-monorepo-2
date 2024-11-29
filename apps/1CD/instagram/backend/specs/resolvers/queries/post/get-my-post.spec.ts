import { getMyPosts } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/post.model', () => ({
  PostModel: {
    find: jest.fn().mockResolvedValue([
      {
        _id: '12',
        user: '1',
        description: 'Post 1',
        images: ['img1'],
        lastComments: 'String',
        commentCount: 1,
        likeCount: 1,
        updatedAt: 'date',
        createdAt: 'date',
      },
    ]),
  },
}));

describe('get my post', () => {
  it('should get my posts', async () => {
    const response = await getMyPosts!({}, { userID: '1' }, {}, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',
        user: '1',
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
