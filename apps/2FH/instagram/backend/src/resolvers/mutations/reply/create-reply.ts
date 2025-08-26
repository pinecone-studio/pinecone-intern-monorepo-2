import { Reply } from 'src/models';
import { GraphQLError } from 'graphql';

interface CreateReplyInput {
  content: string;
}

const validateInput = (input: CreateReplyInput): void => {
  if (!input.content || !input.content.trim()) {
    throw new GraphQLError('Content is required');
  }
};
const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError('Failed to create reply' + (error instanceof Error ? error.message : 'Error'));
};

export const createReply = async (_: unknown, { input }: { input: CreateReplyInput }, context: { userId: string }) => {
  try {
    const author = context.userId;
    if (!author) {
      throw new GraphQLError('User is not authenticated');
    }
    validateInput(input);
    const newReply = await Reply.create({ author, ...input });
    console.log(newReply);
    return newReply;
  } catch (error) {
    handleError(error);
  }
};
