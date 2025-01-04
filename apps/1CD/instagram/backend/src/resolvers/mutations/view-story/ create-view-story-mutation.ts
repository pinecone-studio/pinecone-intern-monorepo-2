import { MutationResolvers } from 'src/generated';
import { viewStoryModel } from 'src/models/story-view.model';

export const createViewStory: MutationResolvers['createViewStory'] = async (_, { input }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const viewedStory = await viewStoryModel.create({ user: input.user, storyId: input.storyId, viewed: input.viewed });
  return viewedStory;
};
