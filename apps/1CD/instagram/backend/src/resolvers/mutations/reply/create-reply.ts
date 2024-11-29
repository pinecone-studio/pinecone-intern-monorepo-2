import { MutationResolvers } from '../../../generated';
import { ReplyModel } from '../../../models/reply.model';



export const createReply: MutationResolvers['createReply'] = async (_, { input }) => {
  const createdPost = await ReplyModel.create({user:input.userID, comment:input.commentID, description:input.description});

  return createdPost;
};
