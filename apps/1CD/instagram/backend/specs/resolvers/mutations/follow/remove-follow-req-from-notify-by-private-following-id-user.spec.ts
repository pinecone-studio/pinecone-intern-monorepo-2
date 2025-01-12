import { GraphQLResolveInfo } from 'graphql';
import { FollowStatus } from 'src/generated';
import { followModel, notificationModel } from 'src/models';
import { removeFollowReqFromNotifyByPrivateFollowingIdUser } from 'src/resolvers/mutations/follow/remove-follow-req-from-notify-by-private-following-id-user';

jest.mock('src/models', () => ({ followModel: { findOne: jest.fn(), findByIdAndDelete: jest.fn() }, notificationModel: { findOneAndDelete: jest.fn() } }));

describe('remove follow request from nitification by private following user', () => {
  const mockFollowReq = { _id: '1221', followerId: '1226', followingId: 'user-126', status: FollowStatus.Pending };

  it('1. should throw error if user not signed in', async () => {
    try {
      await removeFollowReqFromNotifyByPrivateFollowingIdUser!({}, { followerId: mockFollowReq.followerId, followingId: mockFollowReq.followingId }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Authorization'));
    }
  });
  it('2. should throw error when the follow info not found', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    try {
      await removeFollowReqFromNotifyByPrivateFollowingIdUser!({}, { followerId: '1111', followingId: mockFollowReq.followingId }, { userId: 'user-126' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('follow info not found'));
    }
  });
  it('3. should throw error when the following id is not authorized to remove the follow request', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce({ ...mockFollowReq, followingId: 'user123' });

    try {
      await removeFollowReqFromNotifyByPrivateFollowingIdUser!({}, { followerId: mockFollowReq.followerId, followingId: 'user123' }, { userId: 'user-126' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('You are not authorized to remove this follower'));
    }
  });
  it('4. should successfully delete the follow request', async () => {
    (followModel.findOne as jest.Mock).mockResolvedValueOnce(mockFollowReq);
    (followModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockFollowReq);
    (notificationModel.findOneAndDelete as jest.Mock).mockResolvedValueOnce({ otherUserId: '1226', currentUserId: 'user-126' });
    await removeFollowReqFromNotifyByPrivateFollowingIdUser!({}, { followerId: mockFollowReq.followerId, followingId: mockFollowReq.followingId }, { userId: 'user-126' }, {} as GraphQLResolveInfo);
    expect(followModel.findOne).toHaveBeenCalledWith({ followerId: '1226', followingId: 'user-126' });
    expect(followModel.findByIdAndDelete).toHaveBeenCalledWith('1221');
    expect(notificationModel.findOneAndDelete).toHaveBeenCalledWith({ otherUserId: '1226', currentUserId: 'user-126' });
  });
});
