import { followModel } from 'src/models/follow.model';
import { FollowStatus, QueryResolvers } from '../../../generated';
import { storyModel } from 'src/models';

export const getAllUsersWithLatestStories: QueryResolvers['getAllUsersWithLatestStories'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const followings = await followModel.find({ followerId: userId });
  const approvedFollowings = followings.filter((following) => following.status === FollowStatus.Approved);

  if (approvedFollowings.length === 0) return [];

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const latestStories = await storyModel
    .find(
      {
        user: { $in: approvedFollowings.map((item) => item.followingId) },
        'stories.createdAt': { $gte: twentyFourHoursAgo },
      }
      // { stories: { $slice: -1 } }
    )
    .populate({
      path: 'user',
      model: 'userModel',
    });

  const filteredStories = latestStories.map((story) => ({
    _id: story._id,
    user: story.user,
    stories: story.stories.filter((userStory: { createdAt: Date }) => userStory.createdAt >= twentyFourHoursAgo),
  }));

  const sortedStories = filteredStories.sort((a, b) => {
    const latestA = Math.max(...a.stories.map((s: { createdAt: Date }) => s.createdAt.valueOf()));
    const latestB = Math.max(...b.stories.map((s: { createdAt: Date }) => s.createdAt.valueOf()));
    return latestB - latestA;
  });

  return sortedStories;
};
