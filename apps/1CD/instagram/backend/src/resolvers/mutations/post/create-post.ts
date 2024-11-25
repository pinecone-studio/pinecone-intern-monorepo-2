import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';
import { userModel } from '../../../models/user.model';

export const createPost: MutationResolvers['createPost'] = async (_, { user, description, images }) => {
  const createdPost = await PostModel.create({ user, description, images });
  if (!createdPost) {
    throw new Error('Can not create post');
  }
  return createdPost;
};
