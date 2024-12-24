import { QueryResolvers } from '../../../generated';
import { PostModel, PostPopulatedType } from '../../../models/post.model';

export const getMyPosts: QueryResolvers['getMyPosts'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const posts = await PostModel.find({ user: userId }).populate<PostPopulatedType>('user');

  return posts.sort((a, b) => {
    return b.createdAt.valueOf() - a.createdAt.valueOf();
  });
};
