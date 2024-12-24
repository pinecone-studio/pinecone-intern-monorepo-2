import { GraphQLResolveInfo } from 'graphql';
import { followModel } from 'src/models/follow.model';
import { getFollowStatus } from 'src/resolvers/queries';

jest.mock('../../../../src/models/follow.model.ts');

describe('getFollowStatus Resolver', () => {
  const mockUserId = '123';
  const mockFollowerId = '123';
  const mockFollowId = '456';

  const mockFollowStatus = {
    _id: mockFollowId,
    followerId: mockFollowerId,
    followingId: '789',
    status: 'FOLLOWING',
  };

  const context = {
    userId: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if user is not signed in', async () => {
    await expect(getFollowStatus!({}, { _id: mockFollowId, followerId: mockFollowerId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Sign in first');
  });

  it('throws an error if followerId does not match userId', async () => {
    await expect(getFollowStatus!({}, { _id: mockFollowId, followerId: 'invalidId' }, context, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('returns follow status if user is authorized', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(mockFollowStatus);

    const result = await getFollowStatus!({}, { _id: mockFollowId, followerId: mockFollowerId }, context, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({ _id: mockFollowId });
    expect(result).toEqual(mockFollowStatus);
  });

  it('returns null if no follow status is found', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getFollowStatus!({}, { _id: mockFollowId, followerId: mockFollowerId }, context, {} as GraphQLResolveInfo);

    expect(followModel.findOne).toHaveBeenCalledWith({ _id: mockFollowId });
    expect(result).toBeNull();
  });
});
