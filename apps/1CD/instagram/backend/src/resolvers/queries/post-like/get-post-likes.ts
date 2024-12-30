import { PostLikeModel, PostLikeUserPopulatedType } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getPostLikes: QueryResolvers['getPostLikes'] = async (_, { postId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const postLikes = await PostLikeModel.find({ post: postId }).populate<PostLikeUserPopulatedType>('user');
  return postLikes as [];
};
