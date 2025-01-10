import { FollowStatus, MutationResolvers } from '../../../generated';
import { followModel } from '../../../models/follow.model';

export const confirmFollowReq: MutationResolvers['confirmFollowReq'] = async (_: unknown, { followerId }, { userId }) => {
  checkUserIsAuth(userId);

  const followRequest = await followModel.findOne({ followerId, followingId: userId });
  if (!followRequest) throw new Error('Follow request not found');

  if (String(followRequest.followingId) !== String(userId)) {
    throw new Error('You are not authorized to confirm this follow request');
  }

  if (followRequest.status === FollowStatus.Approved) {
    throw new Error('Follow request has already been confirmed');
  }

  followRequest.status = FollowStatus.Approved;
  await followRequest.save();

  return followRequest;
};

const checkUserIsAuth = (userId: string | null) => {
  if (!userId) throw new Error('Unauthorized');
};
