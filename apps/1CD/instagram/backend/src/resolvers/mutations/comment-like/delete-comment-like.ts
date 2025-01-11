import { commentLikeModel } from 'src/models';
import { MutationResolvers } from '../../../generated';

export const deleteCommentLike: MutationResolvers['deleteCommentLike'] = async (_, { commentLikeId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const deleteCommentLike = await commentLikeModel.findByIdAndDelete({ _id: commentLikeId });

  return deleteCommentLike;
};
