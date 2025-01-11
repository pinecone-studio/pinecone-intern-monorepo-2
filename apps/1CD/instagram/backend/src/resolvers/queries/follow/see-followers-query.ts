import { QueryResolvers } from 'src/generated';
import { FollowerPopulatedType, followModel } from 'src/models/follow.model';

export const seeFollowers: QueryResolvers['seeFollowers'] = async (_, { followingId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const followers = await followModel.find({ followingId, status: 'APPROVED' }).populate<FollowerPopulatedType>('followerId');
  return followers as [];
};
