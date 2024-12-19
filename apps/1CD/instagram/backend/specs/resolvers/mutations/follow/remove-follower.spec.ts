import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { followModel } from 'src/models/follow.model';
import { removeFollower } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/follow.model.ts', () => ({
  followModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn().mockReturnValueOnce({ _id: 'a' }).mockReturnValueOnce(null),
  },
}));

describe('removeFollower Mutation', () => {
  const mockSave = jest.fn();
  const mockFollowRequest = {
    _id: '123',
    followingId: 'user-1',
    status: FollowStatus.Approved,
    save: mockSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not authenticated', async () => {
    await expect(removeFollower!({}, { _id: '123' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if follow record is not found', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(removeFollower!({}, { _id: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('Not found');
  });

  it('should throw an error if user is not authorized to remove the follower', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce({
      ...mockFollowRequest,
      followingId: 'user-2',
    });

    await expect(removeFollower!({}, { _id: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('You are not authorized to remove this follower');
  });

  it('should throw an error if the follow status is pending', async () => {
    (followModel.findById as jest.Mock).mockResolvedValueOnce({
      ...mockFollowRequest,
      status: FollowStatus.Pending,
    });

    await expect(removeFollower!({}, { _id: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo)).rejects.toThrow('Failed to remove follower');
  });

  //   it('should successfully delete the follower', async () => {
  //     (followModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockFollowRequest);

  //     const result = await removeFollower!({}, { _id: '123' }, { userId: 'user-1' }, {} as GraphQLResolveInfo);

  //     expect(result).toEqual({
  //       ...mockFollowRequest,
  //     });
  //   });

  it('should successfully delete the follower', async () => {
    (followModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({ _id: 'a' }).mockReturnValueOnce(null);
    const response = await removeFollower!({}, { _id: 'a' }, { userId: 'user-1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: 'a',
    });
  });
});
