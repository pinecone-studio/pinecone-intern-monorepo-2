import { QueryResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const getUserPosts: QueryResolvers['getUserPosts'] = async (_, { user }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const posts = await PostModel.find({ user });
  if (!posts) {
    throw new Error(`User post not found`);
  }
  return posts;
};
