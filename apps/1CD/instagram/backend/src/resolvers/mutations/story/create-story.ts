import { MutationResolvers } from 'src/generated';
import { storyModel } from 'src/models';

export const createStory: MutationResolvers['createStory'] = async (_, { input }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const story = await storyModel.create({ userId: input.userId, description: input.description, image: input.image });
  return story;
};
