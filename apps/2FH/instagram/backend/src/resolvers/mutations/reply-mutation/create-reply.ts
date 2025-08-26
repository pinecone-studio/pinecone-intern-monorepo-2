import { GraphQLError } from 'graphql';
import { Comment, Reply } from 'src/models';

interface CreateReplyInput {
  author: string;
  commentId: string;
  content: string;
  replyId?: string[];
  likes?: string[];
}
const validateInput = (input: CreateReplyInput): void => {
  if (!input.author) {
    throw new GraphQLError('User is not authenticated');
  }
  if (!input.commentId) {
    throw new GraphQLError('commentId is required!');
  }
  if (!input.content) {
    throw new GraphQLError('content is empty');
  }
};
export const createReply = async (_: unknown, { input }: { input: CreateReplyInput }) => {
  try {
    validateInput(input);
    const { author, commentId, content } = input;
    const newReply = await Reply.create({ author, commentId, content });
    await Comment.findByIdAndUpdate(commentId, {
      $push: { reply: newReply},
    });
    return newReply;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to create comment:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
