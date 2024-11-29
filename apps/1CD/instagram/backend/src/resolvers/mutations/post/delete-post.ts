import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const deletePost: MutationResolvers['deletePost'] = async (_, { _id }) => {
  const deletePost = await PostModel.findByIdAndDelete(_id);

  if (!deletePost) {
    throw new Error('Can not delete post');
  }

  return deletePost;
};
