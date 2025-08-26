import { GraphQLError } from 'graphql';
import { Reply } from 'src/models';


interface UpdateReplyInput {
  content: string;
}

function validateInput(input: UpdateReplyInput) {
  if (!input.content) {
    throw new GraphQLError('content is empty');
  }
}

function validateId(_id: string) {
  if (!_id || _id.trim() === '') {
    throw new GraphQLError('Id is not found');
  }
}

function validateUpdatedReply(updatedReply: unknown) {
  if (!updatedReply) {
    throw new GraphQLError('not found Updated reply');
  }
}

async function checkAuthor(_id: string, userId: string) {
  const reply = await Reply.findById(_id);
  if (!reply) throw new GraphQLError('Reply not found');

  if (reply.author.toString() === userId) {
    return reply;
  }

  throw new GraphQLError('You are not allowed to edit this reply');
}

export const updateReplyByContent = async (_: unknown, _id: string, { input }: { input: UpdateReplyInput }, userId: string) => {
  validateInput(input);
  validateId(_id);

  try {
    await checkAuthor(_id, userId);
    const updatedReply = await Reply.findByIdAndUpdate(_id, { content: input.content }, { new: true });
    validateUpdatedReply(updatedReply);
    return updatedReply;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update reply by content:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
