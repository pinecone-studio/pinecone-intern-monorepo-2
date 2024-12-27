import { PostLikeModel } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getPostLike: QueryResolvers['getPostLike'] = async (_, { postId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const postLike = await PostLikeModel.findOne({ post: postId, user: userId });
  if (!postLike) return;
  return postLike;
};
