import { FollowStatus, MutationResolvers } from 'src/generated';
import { followModel } from 'src/models';

export const unfollow: MutationResolvers['unfollow'] = async (_, { _id }, { userId }) => {
  checkUserIsAuth(userId);

  const followRecord = await followModel.findById(_id);

  if (!followRecord) {
    throw new Error('Not found');
  }

  if (String(followRecord.followerId) !== String(userId)) {
    throw new Error('You are not authorized to unfollow');
  }

  if (followRecord.status === FollowStatus.Pending) {
    throw new Error('Failed to unfollow');
  }

  const unfollowUser = await followModel.findByIdAndDelete(_id);

  return unfollowUser;
};

const checkUserIsAuth = (userId: string | null) => {
  if (!userId) throw new Error('Unauthorized');
};
