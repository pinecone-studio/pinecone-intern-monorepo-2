import { Comment, MutationResolvers } from 'src/generated';
import { commentModel, CommentPopulatedType } from 'src/models/comment.model';

export const createComment: MutationResolvers['createComment'] = async (_: unknown, { input }, { userId }) => {
  if (!userId) throw new Error('something wrong in authorization');

  const { postId, commentText } = input;

  const newComment = await commentModel.create({ postId, commentText, commentedUser: userId });

  const populatedNewComment = await commentModel.findById({ _id: newComment._id }).populate<CommentPopulatedType>('commentedUser');

  return populatedNewComment as Comment;
};
