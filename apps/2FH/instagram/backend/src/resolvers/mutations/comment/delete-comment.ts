import { GraphQLError } from 'graphql';
import { Comment } from 'src/models';

function validateId(_id: string) {
  if (!_id || _id.trim() === '') {
    throw new GraphQLError('Id is not found');
  }
}

async function checkAuthor(_id: string, userId: string) {
  if (!userId) throw new GraphQLError('User ID is required');

  const comment = await Comment.findById(_id);
  if (!comment) {
    throw new GraphQLError('comment not found');
  }
  if (comment.author._id.toString() !== userId) {
    throw new GraphQLError('You are not the author of this comment');
  }
}

async function removeCommentById(_id: string) {
  const deletedComment = await Comment.findByIdAndDelete(_id);
  if (!deletedComment) {
    throw new GraphQLError('not found deleted comment');
  }
  return deletedComment;
}

export const deleteComment = async (_: unknown, { _id, userId }: { _id: string; userId: string }) => {
  try {
    validateId(_id);
    await checkAuthor(_id, userId);
    return await removeCommentById(_id);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to delete comment:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
