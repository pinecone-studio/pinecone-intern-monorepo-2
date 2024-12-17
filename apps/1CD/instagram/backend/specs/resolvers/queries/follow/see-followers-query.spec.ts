/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { seeFollowers } from 'src/resolvers/queries';

jest.mock('../../../../src/models/follow.model.ts', () => ({
  followModel: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: '12',
          followerId: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
          followingId: '1',
          status: FollowStatus.Approved,
          updatedAt: 'date',
          createdAt: 'date',
        },
      ]),
    }),
  },
}));

describe('get followers', () => {
  const mockUserId = '12345';

  it('should get followers', async () => {
    const response = await seeFollowers!({}, { followingId: '1' }, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(response).toEqual([
      {
        _id: '12',
        followerId: { _id: '1', userName: 'user 1', profileIma: 'proImg1' },
        followingId: '1',
        status: FollowStatus.Approved,
        updatedAt: 'date',
        createdAt: 'date',
      },
    ]);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(seeFollowers!({}, { followingId: '1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
