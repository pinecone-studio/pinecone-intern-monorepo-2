import { MutationResolvers } from '../../../generated';
import { PostModel } from '../../../models';

export const createPost: MutationResolvers['createPost'] = async (_, { description, images }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const createdPost = await PostModel.create({ user: userId, description, images });

  return createdPost;
};
