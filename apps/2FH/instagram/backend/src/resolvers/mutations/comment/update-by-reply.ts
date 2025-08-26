import { GraphQLError } from 'graphql';
import { Comment } from 'src/models';

interface UpdateCommentInput {
  reply: string[];
}
function validateId(_id: string) {
  if (!_id.trim()) throw new GraphQLError('Id is not found');
}
function validateInput(input: UpdateCommentInput) {
  if (!input.reply.length) {
    throw new GraphQLError('Reply array is empty');
  }
}
async function updateComment(_id: string, input: UpdateCommentInput) {
  const updatedComment = await Comment.findByIdAndUpdate(
    _id,
    { $push: { reply: { $each: input.reply } } },
    { new: true }
  );
  if (!updatedComment) throw new GraphQLError('Comment not found');
  return updatedComment;
}

export const updateCommentByReply = async (_: unknown, _id: string, { input }: { input: UpdateCommentInput }) => {
  validateId(_id);
  validateInput(input);
  try {
    return await updateComment(_id, input);
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update comment by reply:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
