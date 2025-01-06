import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const deletePost: MutationResolvers['deletePost'] = async (_, { _id }, { userId }) => {
  const findPost = await PostModel.findById({ _id: _id });

  if (!findPost) throw new Error('Not found post');

  const userID = findPost.user.toString();

  if (userID === userId) {
    const deletePost = await PostModel.findByIdAndDelete(_id);
    return deletePost;
  }
  throw new Error('Can not delete post');
};
