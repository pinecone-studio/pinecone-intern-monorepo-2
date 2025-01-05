import { followModel } from 'src/models/follow.model';
import { FollowStatus, QueryResolvers } from '../../../generated';
import { storyModel, StoryPopulatedType } from 'src/models';

export const getFollowingStories: QueryResolvers['getFollowingStories'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const followings = await followModel.find({ followerId: userId });

  const approvedFollowings = followings.filter((following) => following.status === FollowStatus.Approved);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await storyModel
    .find({
      userId: { $in: approvedFollowings.map((item) => item.followingId) },
      createdAt: { $gte: twentyFourHoursAgo },
    })
    .populate<StoryPopulatedType>('userId');

  return stories.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
};
