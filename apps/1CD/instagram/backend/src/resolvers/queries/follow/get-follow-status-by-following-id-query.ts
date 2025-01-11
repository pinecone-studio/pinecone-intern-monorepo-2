import { QueryResolvers } from 'src/generated';
import { followModel } from 'src/models/follow.model';

export const getFollowStatusByFollowingId: QueryResolvers['getFollowStatusByFollowingId'] = async (_, { followingId, followerId }, { userId }) => {
  if (!userId) throw new Error('Sign in first');

  if (followingId !== userId) {
    throw new Error('Unauthorized');
  }
  const followStatus = await followModel.findOne({ followingId, followerId });

  return followStatus;
};
