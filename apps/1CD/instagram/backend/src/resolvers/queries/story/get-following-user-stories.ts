import { followModel } from 'src/models/follow.model';
import { FollowStatus, QueryResolvers } from '../../../generated';
import { storyModel } from 'src/models';

export const getFollowingUserStories: QueryResolvers['getFollowingUserStories'] = async (_, { user }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const following = await followModel.findOne({
    followerId: userId,
    followingId: user,
    status: FollowStatus.Approved,
  });

  if (!following) throw new Error('You are not following this user or the follow request is not approved.');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const allStories = await storyModel
    .findOne({
      user: user,
      'stories.createdAt': { $gte: twentyFourHoursAgo },
    })
    .populate({
      path: 'user',
      model: 'userModel',
    });

  const filteredStories = {
    _id: allStories._id,
    user: allStories.user,
    stories: allStories.stories.filter((userStory: { createdAt: Date }) => userStory.createdAt >= twentyFourHoursAgo),
  };

  return filteredStories;
};
