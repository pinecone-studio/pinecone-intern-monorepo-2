import { MutationResolvers } from '../../../generated';
import { ReplyModel } from '../../../models/reply.model';



export const updateReply: MutationResolvers['updateReply'] = async (_, {input}) => {
try {
  const updateReply = await ReplyModel.findByIdAndUpdate(input._id, {description:input.description}, {new: true});
  if (!updateReply) {
    throw new Error('Can not updated reply');
  }
  return updateReply;
} catch (error) {
  console.log("error", error)
}
};
