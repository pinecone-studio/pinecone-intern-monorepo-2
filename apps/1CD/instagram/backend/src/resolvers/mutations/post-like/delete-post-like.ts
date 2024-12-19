import { MutationResolvers } from '../../../generated';
import { PostLikeModel } from '../../../models';

export const deletePostLike: MutationResolvers['deletePostLike'] = async (_, { postLikeId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const deletePostLike = await PostLikeModel.findByIdAndDelete({ _id: postLikeId });

  return deletePostLike;
};
