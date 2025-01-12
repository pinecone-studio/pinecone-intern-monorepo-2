import { QueryResolvers } from 'src/generated';
import { storyModel } from 'src/models';

export const getMyActiveStories: QueryResolvers['getMyActiveStories'] = async (_, __, { userId }) => {
  checkUserIsAuth(userId);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await storyModel.find({ user: userId }).populate({
    path: 'user',
    model: 'userModel',
  });

  if (!stories || stories.length === 0) {
    throw new Error('No stories found or archived');
  }

  const activeStory = stories
    .map((story) => ({
      ...(typeof story.toObject === 'function' ? story.toObject() : story),
      stories: story.stories.filter((userStory: { createdAt: Date }) => userStory.createdAt >= twentyFourHoursAgo),
    }))
    .find((story) => story.stories.length > 0);

  // if (!activeStory) {
  //   console.log('No active stories found');
  // }

  return activeStory;
};

const checkUserIsAuth = (userId: string | null) => {
  if (!userId) throw new Error('Unauthorized');
};
