import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { Comment } from 'src/models/';

const validateInput = (content: string, commentId: string, context: { userId?: string }): void => {
  if (!context.userId) throw new GraphQLError('User not authenticated');
  if (!content.trim()) throw new GraphQLError('Content is empty');
  if (!Types.ObjectId.isValid(commentId)) throw new GraphQLError('Invalid ID format');
};

const validateComment = async (commentId: string) => {
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) throw new GraphQLError('Comment not found');
  return parentComment;
};

export const createReplyOnComment = async (_: unknown, { commentId, content }: { commentId: string; content: string }, context: { userId?: string }) => {
  validateInput(content, commentId, context);
  const parentComment = await validateComment(commentId);

  const newReply = await Comment.create({
    author: new Types.ObjectId(context.userId!),
    parentId: new Types.ObjectId(commentId),
    parentType: 'Comment',
    content,
    comments: [],
    likes: [],
  });

  parentComment.comments.push(newReply._id);
  await parentComment.save();
  return newReply;
};
