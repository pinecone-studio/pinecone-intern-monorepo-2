import { storyModel, StoryPopulatedType } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getMyStories: QueryResolvers['getMyStories'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const myStories = await storyModel.find({ userId }).populate<StoryPopulatedType>('userId');

  return myStories.sort((a, b) => {
    return b.createdAt.valueOf() - a.createdAt.valueOf();
  });
};
