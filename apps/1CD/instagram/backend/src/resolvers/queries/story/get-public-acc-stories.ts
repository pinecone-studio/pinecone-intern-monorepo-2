import { storyModel, userModel } from 'src/models';
import { AccountVisibility, QueryResolvers } from 'src/generated';

export const getPublicAccStories: QueryResolvers['getPublicAccStories'] = async (_, { user }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const publicUser = await userModel.findOne({ _id: user, accountVisibility: AccountVisibility.Public });

  if (!publicUser) throw new Error('User not found');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const allStories = await storyModel
    .findOne({
      user: publicUser,
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
