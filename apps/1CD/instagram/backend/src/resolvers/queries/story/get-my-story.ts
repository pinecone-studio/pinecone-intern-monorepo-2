import { QueryResolvers } from 'src/generated';
import { storyModel } from 'src/models';

export const getMyStory: QueryResolvers['getMyStory'] = async (_, { _id }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const story = await storyModel.findOne({ _id, createdAt: { $gte: twentyFourHoursAgo } }).populate({
    path: 'userId',
    model: 'userModel',
  });

  if (!story) {
    throw new Error('Story not found or is archieved');
  }

  if (String(story.userId._id) !== String(userId)) {
    throw new Error('You are not allowed to see this story info');
  }

  return story;
};
