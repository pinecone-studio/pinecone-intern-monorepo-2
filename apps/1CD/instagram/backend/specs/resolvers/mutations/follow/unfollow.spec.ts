import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { followModel } from 'src/models';
import { unfollow } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  followModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('removeFollower Mutation', () => {
  const mockFollowRequest = {
    _id: '123',
    followerId: 'user-1',
    status: FollowStatus.Approved,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not authenticated', async () => {
    await expect(unfollow!({}, { _id: '123', followerId: 'user-1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if follow record is not found', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(unfollow!({}, { _id: '123', followerId: 'user-1' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('Not found');
  });

  it('should throw an error if user is not authorized to remove the follower', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce({
      ...mockFollowRequest,
      followerId: 'user-2',
    });

    await expect(unfollow!({}, { _id: '123', followerId: 'user-2' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('You are not authorized to unfollow');
  });

  it('should successfully delete the follower', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce(mockFollowRequest);
    (followModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockFollowRequest);

    const result = await unfollow!({}, { _id: '123', followerId: 'user-1' }, { userId: 'user-1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockFollowRequest);
    expect(followModel.findById).toHaveBeenCalledWith('123');
    expect(followModel.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});
