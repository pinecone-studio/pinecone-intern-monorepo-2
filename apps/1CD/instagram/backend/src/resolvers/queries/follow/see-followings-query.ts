import { QueryResolvers } from 'src/generated';
import { followModel, FollowPopulatedType } from 'src/models/follow.model';

export const seeFollowings: QueryResolvers['seeFollowings'] = async (_, { followerId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const followings = await followModel.find({ followerId, status: 'APPROVED' }).populate<FollowPopulatedType>('followingId');
  return followings as [];
};
