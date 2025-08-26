import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError('Failed to update reply' + (error instanceof Error ? error.message : 'Error'));
};

export const updateReply = async (_: unknown, { _id, input }: { _id: string; input: { content: string } }, context: { userId: string }) => {
  try {
    const author = context.userId;
    if (!author) {
      throw new GraphQLError('User is not authenticated');
    }

    const reply = await Reply.findByIdAndUpdate(_id, { content: input.content }, { new: true });
    if (!reply) {
      throw new GraphQLError('Reply not found');
    }

    return reply;
  } catch (error) {
    handleError(error);
  }
};
