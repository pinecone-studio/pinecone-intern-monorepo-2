import { FollowStatus, MutationResolvers } from 'src/generated';
import { followModel } from 'src/models';

export const removeFollower: MutationResolvers['removeFollower'] = async (_, { _id }, { userId }) => {
  checkUserIsAuth(userId);

  const followRecord = await followModel.findOne({ followerId: _id, followingId: userId });
  if (!followRecord) {
    throw new Error('Not found');
  }

  if (String(followRecord.followingId) !== String(userId)) {
    throw new Error('You are not authorized to remove this follower');
  }

  if (followRecord.status === FollowStatus.Pending) {
    throw new Error('Failed to remove follower');
  }

  const deleteFollower = await followModel.findByIdAndDelete(followRecord._id);

  return deleteFollower;
};

const checkUserIsAuth = (userId: string | null) => {
  if (!userId) throw new Error('Unauthorized');
};
