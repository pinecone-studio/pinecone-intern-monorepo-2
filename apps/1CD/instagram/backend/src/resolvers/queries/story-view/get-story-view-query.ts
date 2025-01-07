import { QueryResolvers } from 'src/generated';
import { viewStoryModel } from 'src/models/story-view.model';

export const getStoryViewer: QueryResolvers['getStoryViewer'] = async (_, { storyId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const storyViewer = await viewStoryModel.findOne({ storyId }).populate({
    path: 'watchedUsers.user',
    model: 'userModel',
  });

  if (!storyViewer) {
    throw new Error('Story not found or no viewers');
  }

  return storyViewer;
};
