import { sendFollowReq } from '../../../../src/resolvers/mutations/follow/send-follow-req';
import { userModel } from '../../../../src/models/user.model';
import { followModel } from '../../../../src/models/follow.model';
import { GraphQLResolveInfo } from 'graphql';
import { AccountVisibility, FollowStatus } from '../../../../src/generated';

jest.mock('../../../../src/models/user.model');
jest.mock('../../../../src/models/follow.model');

describe('sendFollowReq', () => {
  const followerId = 'followerId';
  const followingId = 'followingId';

  it('should throw an error if the userId and followerId do not match', async () => {
    await expect(sendFollowReq!({}, { followerId, followingId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should create a follow request with APPROVED status for public account', async () => {
    const mockUser = { accountVisibility: AccountVisibility.Public };
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (followModel.create as jest.Mock).mockResolvedValue({ _id: '1', followerId, followingId, status: FollowStatus.Approved });

    const result = await sendFollowReq!({}, { followerId, followingId }, { userId: 'followerId' }, {} as GraphQLResolveInfo);

    expect(userModel.findById).toHaveBeenCalledWith(followingId);
    expect(followModel.create).toHaveBeenCalledWith({
      followerId,
      followingId,
      status: FollowStatus.Approved,
    });
    expect(result).toEqual({ _id: '1', followerId, followingId, status: FollowStatus.Approved });
  });

  it('should create a follow request with PENDING status for private account', async () => {
    const mockUser = { accountVisibility: AccountVisibility.Private };
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (followModel.create as jest.Mock).mockResolvedValue({ _id: '1', followerId, followingId, status: FollowStatus.Pending });

    const result = await sendFollowReq!({}, { followerId, followingId }, { userId: 'followerId' }, {} as GraphQLResolveInfo);

    expect(userModel.findById).toHaveBeenCalledWith(followingId);
    expect(followModel.create).toHaveBeenCalledWith({
      followerId,
      followingId,
      status: FollowStatus.Pending,
    });
    expect(result).toEqual({ _id: '1', followerId, followingId, status: FollowStatus.Pending });
  });

  it('should throw an error if the user is not found', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(sendFollowReq!({}, { followerId, followingId }, { userId: 'followerId' }, {} as GraphQLResolveInfo)).rejects.toThrow('User not found');
  });
});
