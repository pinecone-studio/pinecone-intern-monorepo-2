import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { Comment } from 'src/models/';
import { PostModel } from 'src/models/';

const validateInput = (content: string, postId: string, context: { user?: { id: string } }): void => {
  if (!context.user) throw new GraphQLError('User not authenticated');
  if (!content.trim()) throw new GraphQLError('Content is empty');
  if (!Types.ObjectId.isValid(postId)) throw new GraphQLError('Invalid ID format');
};

const validatePost = async (postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new GraphQLError('Post not found');
  return post;
};

export const createCommentOnPost = async (_: unknown, { postId, content }: { postId: string; content: string }, context: { user?: { id: string } }) => {
  validateInput(content, postId, context);
  const post = await validatePost(postId);

  const newComment = await Comment.create({
    author: new Types.ObjectId(context.user!.id),
    parentId: new Types.ObjectId(postId),
    parentType: 'Post',
    content,
    comments: [],
    likes: [],
  });

  post.comments.push(newComment._id);
  await post.save();

  return newComment;
};
