import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { PostModel } from '../../../models';

export const createPost: MutationResolvers['createPost'] = async (_, { user, description, images }) => {
  const findUser = await userModel.findById({ _id: user });

  if (!findUser) {
    throw new Error('Not found user');
  }

  const createdPost = await PostModel.create({ user, description, images });

  if (!createdPost) {
    throw new Error('Can not create post');
  }
  return createdPost;
};
