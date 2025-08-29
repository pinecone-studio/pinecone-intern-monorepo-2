import { GraphQLError } from 'graphql';
import { PostModel, User } from 'src/models';

const validatePost = (author: string, image: string[]) => {
  if (!author) {
    throw new GraphQLError('User not found');
  }
  if (!image || image.length === 0) {
    throw new GraphQLError('Images not found');
  }
};
export const createPost = async (_: unknown, { author, input }: { author: string; input: { image: string[]; caption?: string } }) => {
  try {
    validatePost(author, input.image);
    const post = await PostModel.create({ author, ...input });
    await User.findByIdAndUpdate(author, { $push: { posts: post } }, { new: true });
    return post;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to create post:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
