import { GraphQLError } from 'graphql';
import { Reply } from 'src/models';

interface UpdateReplyInput {
  reply: string[];
}
function validateId(_id: string) {
  if (!_id.trim()) throw new GraphQLError('Id is not found');
}
function validateInput(input: UpdateReplyInput) {
  if (!input.reply.length) {
    throw new GraphQLError('Reply array is empty');
  }
}
async function updateReply(_id: string, input: UpdateReplyInput) {
  const updatedReply = await Reply.findByIdAndUpdate(_id, { $push: { reply: { $each: input.reply } } }, { new: true });
  if (!updatedReply) throw new GraphQLError('Reply not found');
  return updatedReply;
}

export const updateReplyByReply = async (_: unknown, _id: string, { input }: { input: UpdateReplyInput }) => {
  validateId(_id);
  validateInput(input);
  try {
    return await updateReply(_id, input);
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update reply by reply:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
