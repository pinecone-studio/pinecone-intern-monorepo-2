import { MutationResolvers } from 'src/generated';
import { commentModel } from 'src/models/comment.model';

export const updateComment: MutationResolvers['updateComment'] = async (_: unknown, { input }, { userId }) => {
  const { _id, commentText } = input;
  if (!userId) throw new Error('error in authorization');
  const renewedComment = await commentModel.findByIdAndUpdate(_id, { commentText }, { new: true });
  if (!renewedComment) throw new Error('can not find comment id');
  return renewedComment;
};
