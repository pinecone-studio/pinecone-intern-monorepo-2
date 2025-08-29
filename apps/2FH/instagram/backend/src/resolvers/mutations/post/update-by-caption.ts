import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { PostModel } from 'src/models';

interface updatePostByCaptionInput {
  caption: string;
  _id: string;
  userId: string;
}

const validateInput = (input: updatePostByCaptionInput): void => {
  if (!input._id) throw new GraphQLError('Post _id is reqiured');
  if (!input.caption) throw new GraphQLError('caption is missing');
  if (!input.userId) throw new GraphQLError('not found authinticated user');
};
const invalidIds = (_id: string, userId: string): void => {
  if (!Types.ObjectId.isValid(_id)) throw new GraphQLError('Invalid post ID');
  if (!Types.ObjectId.isValid(userId)) throw new GraphQLError('Invalid auth user ID');
};
const checkAuthor = async (_id: string, userId: string) => {
  const post = await PostModel.findOne({ _id });
  if (!post) throw new GraphQLError('Post is not found');
  if (post.author.toString() !== userId) throw new GraphQLError('You are not author of this post');
  return post;
};
 const updatePost = async (input: updatePostByCaptionInput) => {
  validateInput(input);
  invalidIds(input._id, input.userId);
  await checkAuthor(input._id, input.userId);
  const updatedPost = await PostModel.findByIdAndUpdate(input._id, { caption: input.caption }, { new: true });
  if (!updatedPost) throw new GraphQLError('not found updated post');
  return updatedPost;
};
export const updatePostByCaption = async (_: unknown, { _id, caption }: { _id: string; caption: string }, { context }: { context: { userId: string } }) => {
  try {
    const input = { _id, caption, userId: context.userId };
    return await updatePost(input);
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update post by caption:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
