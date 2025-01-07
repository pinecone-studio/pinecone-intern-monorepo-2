import { Post, QueryResolvers } from '../../../generated';
import { PostModel, PostPopulatedType } from '../../../models/post.model';

export const getPostByPostId: QueryResolvers['getPostByPostId'] = async (_, { postId }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const post = await PostModel.findOne({ _id: postId }).populate<PostPopulatedType>('user');
  return post as Post;
};
