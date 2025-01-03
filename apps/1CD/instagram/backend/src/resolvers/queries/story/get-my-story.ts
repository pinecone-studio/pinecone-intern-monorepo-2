import { storyModel, StoryPopulatedType } from 'src/models';
import { QueryResolvers, StoryInfo } from '../../../generated';

export const getMyStory: QueryResolvers['getMyStory'] = async (_, { _id }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const story = await storyModel.findOne({ _id }).populate<StoryPopulatedType>('userId');

  if (!story) {
    throw new Error(`Story not found`);
  }
  return story as StoryInfo;
};
