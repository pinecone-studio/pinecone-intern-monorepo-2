import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { PostModel, User } from 'src/models';

const validatePost = (author: string, image: string[]) => {
  if (!author) {
    throw new GraphQLError('User not found');
  }
  if (!image || image.length === 0) {
    throw new GraphQLError('Images not found');
  }
};
export const createPost = async (_: unknown, { input }: { input: { image: string[]; caption?: string } }, context: { userId: string }) => {
  try {
    const author = context.userId;
    validatePost(author, input.image);
    const post = await PostModel.create({ author: new Types.ObjectId(author), ...input });
    console.log('Post created:', post);

    const updatedUser = await User.findByIdAndUpdate(
      author,
      { $push: { posts: post._id } }, // post._id ашиглах
      { new: true }
    );
    console.log('User updated:', updatedUser);

    return post;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to create post:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
