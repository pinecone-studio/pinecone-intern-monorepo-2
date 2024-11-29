import { QueryResolvers } from '../../../generated';
import { PostModel } from '../../../models/post.model';

export const getMyPosts: QueryResolvers['getMyPosts'] = async (_, { userID }) => {
  const posts = await PostModel.find({ user: userID });
  return posts;
};
