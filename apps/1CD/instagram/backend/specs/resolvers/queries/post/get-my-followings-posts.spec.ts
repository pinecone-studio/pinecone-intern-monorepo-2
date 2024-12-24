/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getMyFollowingsPosts } from '../../../../src/resolvers/queries';

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

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    find: jest.fn().mockReturnValueOnce([
      {
        _id: '12',
        user: 'user1',
        description: 'Post 1',
        images: ['img1'],
      },
      {
        _id: '12',
        user: 'user2',
        description: 'Post 1',
        images: ['img1'],
      },
    ]),
  },
}));

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    find: jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce([
        {
          _id: '12',
          user: {
            _id: 'user1',
            userName: 'Test',
          },
          description: 'Post 1',
          images: ['img1'],
               createdAt: '2024-12-20T06:11:30.947Z',
        },
        {
          _id: '12',
          user: {
            _id: 'user2',
            userName: 'Test',
          },
          description: 'Post 1',
          images: ['img1'],
          createdAt: '2024-12-20T06:11:30.947Z',
        },
      ]),
    }),
  },
}));

describe('getMyFollowingsPosts', () => {
  it('should get MyFollowingsPosts', async () => {
    const response = await getMyFollowingsPosts!({}, {}, { userId: '12345' }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',
        user: {
          _id: 'user1',
          userName: 'Test',
        },
        description: 'Post 1',
        images: ['img1'],
        createdAt: '2024-12-20T06:11:30.947Z',
      },
      {
        _id: '12',
        user: {
          _id: 'user2',
          userName: 'Test',
        },
        description: 'Post 1',
        images: ['img1'],
        createdAt: '2024-12-20T06:11:30.947Z',
      },
    ]);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getMyFollowingsPosts!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
