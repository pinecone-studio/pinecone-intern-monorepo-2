import { MutationResolvers } from 'src/generated';
import { storyModel } from 'src/models';
import mongoose from 'mongoose';

export const createStory: MutationResolvers['createStory'] = async (_, { input }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const findStoryByUserId = await storyModel.findOne({ user: input.user });

  if (!findStoryByUserId) {
    const story = await storyModel.create({
      user: input.user,
      stories: [
        {
          _id: new mongoose.Types.ObjectId(),
          image: input.image,
        },
      ],
    });
    return story;
  }

  findStoryByUserId.stories.push({
    _id: new mongoose.Types.ObjectId(),
    image: input.image,
  });

  const updatedData = await findStoryByUserId.save();
  return updatedData;
};
