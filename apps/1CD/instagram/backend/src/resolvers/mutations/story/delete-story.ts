import mongoose from 'mongoose';
import { MutationResolvers } from 'src/generated';
import { storyModel } from 'src/models';

export const deleteStory: MutationResolvers['deleteStory'] = async (_, { storyId }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const storyDocument = await storyModel.findOne({ 'stories._id': storyId, user: userId });

  if (!storyDocument) {
    throw new Error('Story not found or you are not authorized to delete this story');
  }

  storyDocument.stories = storyDocument.stories.filter((userStory: { _id: mongoose.Types.ObjectId }) => userStory._id.toString() !== storyId);

  const updatedStoryDocument = await storyDocument.save();

  return {
    message: 'Story deleted successfully',
    story: updatedStoryDocument,
  };
};

// export const deleteStory: MutationResolvers['deleteStory'] = async (_, { storyId }, { userId }) => {
//   if (!userId) {
//     throw new Error('Unauthorized');
//   }

//   const storyDocument = await storyModel.findOne({ 'stories._id': storyId });

//   if (!storyDocument || storyDocument.user.toString() !== userId) {
//     throw new Error('Story not found or you are not authorized to delete this story');
//   }

//   storyDocument.stories = storyDocument.stories.filter((userStory: { _id: mongoose.Types.ObjectId }) => userStory._id.toString() !== storyId);

//   const updatedStoryDocument = await storyDocument.save();

//   return {
//     message: 'Story deleted successfully',
//     story: updatedStoryDocument,
//   };
// };
