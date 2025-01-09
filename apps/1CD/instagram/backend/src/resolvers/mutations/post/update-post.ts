import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const updatePost: MutationResolvers['updatePost'] = async (_, { input }, { userId }) => {
  const findPost = await PostModel.findById({ _id: input._id });

  if (!findPost) throw new Error('Not found post');

  if (findPost.user.toString() === userId) {
    const updatedPost = await PostModel.findByIdAndUpdate({ _id: input._id }, { description: input.description, images: input.images }, { new: true });
    return updatedPost;
  }

  throw new Error('Can not updated post');
};
