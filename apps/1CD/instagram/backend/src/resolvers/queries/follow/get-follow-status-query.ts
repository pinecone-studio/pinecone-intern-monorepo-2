import { QueryResolvers } from 'src/generated';
import { followModel } from 'src/models/follow.model';

export const getFollowStatus: QueryResolvers['getFollowStatus'] = async (_, { followingId, followerId }, { userId }) => {
  if (!userId) throw new Error('Sign in first');

  if (followerId !== userId) {
    throw new Error('Unauthorized');
  }
  const followStatus = await followModel.findOne({ followingId, followerId });

  return followStatus;
};
