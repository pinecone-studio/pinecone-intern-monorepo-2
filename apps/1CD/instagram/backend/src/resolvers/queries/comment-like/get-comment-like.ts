import { commentLikeModel } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getCommentLike: QueryResolvers['getCommentLike'] = async (_, { commentId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const postLike = await commentLikeModel.findOne({ comment: commentId, likedUser: userId });
  if (!postLike) return;
  return postLike;
};
