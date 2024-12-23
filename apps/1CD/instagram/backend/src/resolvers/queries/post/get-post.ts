import { Post, QueryResolvers } from '../../../generated';
import { PostModel, PostPopulatedType } from '../../../models/post.model';

export const getPost: QueryResolvers['getPost'] = async (_, { _id }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const post = await PostModel.findOne({ _id }).populate<PostPopulatedType>('user');
  if (!post) {
    throw new Error(`Post with ID ${_id} not found`);
  }
  return post as Post;
};
