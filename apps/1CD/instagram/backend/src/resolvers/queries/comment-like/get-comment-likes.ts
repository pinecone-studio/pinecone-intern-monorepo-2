import { commentLikeModel, PopulatedType } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getCommentLikes: QueryResolvers['getCommentLikes'] = async (_, { commentId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const postLikes = await commentLikeModel.find({ comment: commentId }).populate<PopulatedType>('likedUser');
  return postLikes as [];
};
