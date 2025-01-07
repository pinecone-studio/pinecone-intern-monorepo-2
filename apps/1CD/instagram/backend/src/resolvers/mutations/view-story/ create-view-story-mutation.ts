import { MutationResolvers } from 'src/generated';
import { viewStoryModel } from 'src/models/story-view.model';

export const createViewStory: MutationResolvers['createViewStory'] = async (_, { input }) => {
  const findStoryId = await viewStoryModel.findOne({ storyId: input.storyId });

  if (!findStoryId) {
    const viewedStory = await viewStoryModel.create({
      watchedUsers: [{ user: input.user, isViewed: input.isViewed }],
      storyId: input.storyId,
    });
    return viewedStory;
  }

  const findDuplicated = findStoryId.watchedUsers.findIndex((item: { user: string }) => item.user.toString() === input.user);

  if (findDuplicated === -1) {
    findStoryId.watchedUsers.push({ user: input.user, isViewed: input.isViewed });
  }

  const updatedData = await findStoryId.save();
  return updatedData;
};
