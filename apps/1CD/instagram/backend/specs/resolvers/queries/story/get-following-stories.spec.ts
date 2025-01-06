import { GraphQLResolveInfo } from 'graphql';
import { getFollowingStories } from '../../../../src/resolvers/queries';

jest.mock('../../../../src/models/follow.model.ts', () => ({
  followModel: {
    find: jest
      .fn()
      .mockReturnValueOnce([
        { followerId: '1', status: 'APPROVED', followingId: 'user1' },
        { followerId: '1', status: 'APPROVED', followingId: 'user2' },
        { followerId: '1', status: 'PENDING', followingId: 'user3' },
      ])
      .mockReturnValueOnce({ followerId: null }),
  },
}));

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    find: jest.fn().mockReturnValueOnce([
      {
        _id: '12',
        description: 'Post 1',
        image: 'img1',
        createdAt: '2024-12-20T06:11:30.947Z',
      },
      {
        _id: '12',
        description: 'Post 1',
        image: 'img1',
        createdAt: '2024-12-20T06:11:30.947Z',
      },
    ]),
  },
}));

jest.mock('../../../../src/models/story.model.ts', () => ({
  storyModel: {
    find: jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce([
        {
          _id: '12',
          userId: {
            _id: 'user1',
            userName: 'Test',
          },
          description: 'Post 1',
          image: 'img1',
          createdAt: '2024-12-20T06:11:30.947Z',
        },
        {
          _id: '12',
          userId: {
            _id: 'user2',
            userName: 'Test',
          },
          description: 'Post 1',
          image: 'img1',
          createdAt: '2024-12-20T06:11:30.947Z',
        },
      ]),
    }),
  },
}));

describe('getMyFollowingsStories', () => {
  it('should get MyFollowingsStories', async () => {
    const response = await getFollowingStories!({}, {}, { userId: '12345' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',
        userId: {
          _id: 'user1',
          userName: 'Test',
        },
        description: 'Post 1',
        image: 'img1',
        createdAt: '2024-12-20T06:11:30.947Z',
      },
      {
        _id: '12',
        userId: {
          _id: 'user2',
          userName: 'Test',
        },
        description: 'Post 1',
        image: 'img1',
        createdAt: '2024-12-20T06:11:30.947Z',
      },
    ]);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getFollowingStories!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
