import { PostLikeModel } from 'src/models';
import { QueryResolvers } from '../../../generated';

export const getPostLikes: QueryResolvers['getPostLikes'] = async (_, { postId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const postLikes = await PostLikeModel.find({ post: postId });
  if (!postLikes) throw new Error('This post have not a like');
  return postLikes;
};
