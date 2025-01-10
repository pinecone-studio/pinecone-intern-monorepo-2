import { QueryResolvers } from 'src/generated';

import { FollowerPopulatedType, followModel, FollowPopulatedType } from 'src/models/follow.model';

export const getSuggestUser: QueryResolvers['getSuggestUser'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const myFollowingInfo = await followModel.find({ followerId: userId }).populate<FollowPopulatedType>('followingId');

  const followingsOfMyFollowings = await followModel
    .find({
      followerId: myFollowingInfo.map((item) => item.followingId._id),
    })
    .populate<FollowerPopulatedType>('followerId')
    .populate<FollowPopulatedType>('followingId');

  // const SuggestFollowingsWithUser = followingsOfMyFollowings.filter((item) => !myFollowingInfo.map((i) => String(i.followingId._id)).includes(String((item?.followingId as any)._id)));

  // const SuggestFollowerDuplicate = SuggestFollowingsWithUser.filter((item) => String((item?.followingId as any)._id) !== userId);
  // const SuggestUser = SuggestFollowerDuplicate.filter((obj, index, self) => index === self.findIndex((t) => (t.followingId as any)._id === (obj.followingId as any)._id));
  return followingsOfMyFollowings as [];
};
