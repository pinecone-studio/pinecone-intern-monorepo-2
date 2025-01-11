import { GraphQLResolveInfo } from 'graphql';
import { followModel } from 'src/models/follow.model';
import { getFollowStatusByFollowingId } from 'src/resolvers/queries/follow/get-follow-status-by-following-id-query';

jest.mock('../../../../src/models/follow.model.ts');

describe('getFollowStatusBy following ID', () => {
  const mockUserId = '1234';
  const mockFollowerId = '123';
  const mockFollowId = '456';
  const mockFollowingId = '1234';
  const mockFollowStatus = {
    _id: mockFollowId,
    followerId: 789,
    followingId: mockFollowingId,
    status: 'FOLLOWING',
  };
  const context = {
    userId: mockUserId,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('1. throws an error if user is not signed in', async () => {
    await expect(getFollowStatusByFollowingId!({}, { followingId: mockFollowingId, followerId: mockFollowerId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Sign in first');
  });

  it('2. throws an error if followingId does not match userId', async () => {
    await expect(getFollowStatusByFollowingId!({}, { followingId: 'invalidId', followerId: mockFollowerId }, context, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('3. returns follow status if user is authorized', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(mockFollowStatus);

    const result = await getFollowStatusByFollowingId!({}, { followingId: mockFollowingId, followerId: mockFollowerId }, context, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({ followingId: mockFollowingId, followerId: mockFollowerId });
    expect(result).toEqual(mockFollowStatus);
  });

  it('4. returns null if no follow status is found', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getFollowStatusByFollowingId!({}, { followingId: mockFollowingId, followerId: mockFollowerId }, context, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({ followingId: mockFollowingId, followerId: mockFollowerId });
    expect(result).toBeNull();
  });
});
