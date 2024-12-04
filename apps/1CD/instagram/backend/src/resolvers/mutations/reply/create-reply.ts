import { ReplyModel } from 'src/models/reply-model';
import { MutationResolvers } from '../../../generated';

export const createReply: MutationResolvers['createReply'] = async (_, { input }) => {
  const createdReply = await ReplyModel.create({ user: input.userID, comment: input.commentID, description: input.description });

  return createdReply;
};
