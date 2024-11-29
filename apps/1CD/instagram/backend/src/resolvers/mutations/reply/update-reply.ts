import { MutationResolvers } from '../../../generated';
import { ReplyModel } from '../../../models/reply.model';



export const updateReply: MutationResolvers['updateReply'] = async (_, {userID}) => {
  const updateReply = await ReplyModel.findByIdAndUpdate({userID},{new: true});
  if (!updateReply) {
    throw new Error('Can not updated post');
  }

  
  return updateReply;
};
