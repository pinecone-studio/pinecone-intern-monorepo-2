import { GraphQLError } from 'graphql';
import { Reply } from 'src/models';

function validateId(_id: string) {
  if (!_id || _id.trim() === '') {
    throw new GraphQLError('Id is not found');
  }
}

function validateDeleted(deletedReply: unknown) {
  if (!deletedReply) {
    throw new GraphQLError('not found deleted reply');
  }
}

async function checkAuthor(_id: string, userId?: string) {
  if (!userId) {
    throw new GraphQLError('auth user Id is missing');
  }
  const reply = await Reply.findById(_id);
  if (!reply) {
    throw new GraphQLError('Reply not found');
  }
  if (reply.author._id.toString() !== userId) {
    throw new GraphQLError('You are not author of this reply');
  }
}

export const deleteReply = async (_: unknown, _id: string, userId?: string) => {
  validateId(_id);
  await checkAuthor(_id, userId);
  try {
    const deletedReply = await Reply.findByIdAndDelete(_id);
    validateDeleted(deletedReply);
    return deletedReply;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to delete reply:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
