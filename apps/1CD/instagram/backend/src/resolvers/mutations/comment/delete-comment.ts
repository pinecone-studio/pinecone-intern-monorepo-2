import { MutationResolvers } from 'src/generated';
import { commentModel } from 'src/models/comment.model';

export const deleteComment: MutationResolvers['deleteComment'] = async (_: unknown, { _id }, { userId }) => {
  if (!userId) throw new Error('wrong in authorization');
  const commentDeletion = await commentModel.findByIdAndDelete(_id);
  if (!commentDeletion) throw new Error('id not found and can not delete comment');
  return commentDeletion;
};
