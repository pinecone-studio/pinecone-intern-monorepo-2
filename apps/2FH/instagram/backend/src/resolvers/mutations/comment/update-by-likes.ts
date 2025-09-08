import { GraphQLError } from 'graphql';
import { Comment, CommentSchemaType } from 'src/models';

interface UpdateCommentInput {
  likes: string[];
}

function getInputLikes(input?: UpdateCommentInput) {
  if (!input) {
    throw new Error('Input is missing');
  }

  if (!Array.isArray(input.likes)) {
    throw new Error('Likes is not an array');
  }

  // Allow empty array for unliking all comments
  return input.likes;
}

function validateId(_id: string) {
  if (!_id.trim()) throw new GraphQLError('Id is not found');
}

function assertComment(comment: CommentSchemaType | null): CommentSchemaType {
  if (!comment) throw new GraphQLError('Comment not found');
  return comment;
}
function getUpdateOps(currentLikes: string[], inputLikes: string[]) {
  // If inputLikes is empty, remove all likes
  if (inputLikes.length === 0) {
    return { $set: { likes: [] } };
  }
  
  // Otherwise, use the existing logic for adding/removing specific likes
  const toAdd = inputLikes.filter((id) => !currentLikes.includes(id));
  const toRemove = currentLikes.filter((id) => !inputLikes.includes(id));
  const updateOps: Record<string, unknown> = {};
  if (toAdd.length > 0) updateOps.$addToSet = { likes: { $each: toAdd } };
  if (toRemove.length > 0) updateOps.$pull = { likes: { $in: toRemove } };
  return updateOps;
}

export const updateCommentByLikes = async (_: unknown, { _id, input }: { input: UpdateCommentInput; _id: string }) => {
  validateId(_id);
  const inputLikes = getInputLikes(input);

  try {
    const comment = assertComment(await Comment.findById(_id));
    const currentLikes = comment.likes.map((like) => like.toString());

    const updateOps = getUpdateOps(currentLikes, inputLikes);

    return assertComment(await Comment.findByIdAndUpdate(_id, updateOps, { new: true }));
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update likes:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
