import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError('Failed to delete reply' + (error instanceof Error ? error.message : 'Error'));
};

export const deleteReply = async (_: unknown, { _id }: { _id: string }, context: { userId: string }) => {
  try {
    const author = context.userId;
    if (!author) {
      throw new GraphQLError('User is not authenticated');
    }

    const reply = await Reply.findByIdAndDelete(_id);
    if (!reply) {
      throw new GraphQLError('Reply not found');
    }

    return true;
  } catch (error) {
    handleError(error);
  }
};
