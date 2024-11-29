import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const updatePost: MutationResolvers['updatePost'] = async (_, { input }) => {
  const updatedPost = await PostModel.findByIdAndUpdate(input._id, { description: input.description, images: input.images }, { new: true });

  if (!updatedPost) {
    throw new Error('Can not updated post');
  }

  return updatedPost;
};
