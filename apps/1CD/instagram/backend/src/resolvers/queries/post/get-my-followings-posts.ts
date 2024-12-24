import { followModel } from 'src/models/follow.model';
import { FollowStatus, QueryResolvers } from '../../../generated';
import { PostModel, PostPopulatedType } from '../../../models/post.model';

export const getMyFollowingsPosts: QueryResolvers['getMyFollowingsPosts'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const followings = await followModel.find({ followerId: userId });

  const approvedFollowings = followings.filter((following) => {
    return following.status === FollowStatus.Approved;
  });

  const posts = await PostModel.find({
    user: approvedFollowings.map((item) => {
      return item.followingId;
    }),
  }).populate<PostPopulatedType>('user');

  return posts.sort((a, b) => {
    return b.createdAt.valueOf() - a.createdAt.valueOf();
  });
};
