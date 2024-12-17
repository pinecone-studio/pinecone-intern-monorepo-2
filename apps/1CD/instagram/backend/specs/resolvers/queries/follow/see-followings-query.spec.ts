/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { seeFollowings } from 'src/resolvers/queries';

jest.mock('../../../../src/models/follow.model.ts', () => ({
  followModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: '12',
          followerId: '1',
          followingId: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
          status: FollowStatus.Approved,
          updatedAt: 'date',
          createdAt: 'date',
        },
      ]),
    }),
  },
}));

describe('get followings', () => {
  const mockUserId = '12345';

  it('should get followings', async () => {
    const response = await seeFollowings!({}, { followerId: '1' }, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',
        followerId: '1',
        followingId: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        status: FollowStatus.Approved,
        updatedAt: 'date',
        createdAt: 'date',
      },
    ]);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(seeFollowings!({}, { followerId: '1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
