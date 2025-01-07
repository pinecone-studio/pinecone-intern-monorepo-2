import { MutationResolvers } from 'src/generated';
import { storyModel } from 'src/models';
import mongoose from 'mongoose';

export const createStory: MutationResolvers['createStory'] = async (_, { input }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const findStoryByUserId = await storyModel.findOne({ userId: input.userId });

  if (!findStoryByUserId) {
    const story = await storyModel.create({
      userId: input.userId,
      userStories: [
        {
          story: {
            _id: new mongoose.Types.ObjectId(),
            description: input.description,
            image: input.image,
          },
        },
      ],
    });
    return story;
  }

  findStoryByUserId.userStories.push({
    story: {
      _id: new mongoose.Types.ObjectId(),
      description: input.description,
      image: input.image,
    },
  });

  const updatedData = await findStoryByUserId.save();
  return updatedData;
};
