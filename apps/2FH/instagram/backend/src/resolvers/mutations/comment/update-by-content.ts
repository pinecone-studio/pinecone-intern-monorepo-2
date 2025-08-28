import { GraphQLError } from 'graphql';
import { Comment } from 'src/models';

interface UpdateCommentInput {
  content: string;
}

function validateInput(input: UpdateCommentInput) {
  if (!input.content) {
    throw new GraphQLError('content is empty');
  }
}

function validateId(_id: string) {
  if (!_id || _id.trim() === '') {
    throw new GraphQLError('Id is not found');
  }
}

function validateUpdatedComment(updatedComment: unknown) {
  if (!updatedComment) {
    throw new GraphQLError('not found Updated comment');
  }
}

async function checkAuthor(_id: string, userId: string) {
  const comment = await Comment.findById(_id);
  if (!comment) throw new GraphQLError('Comment not found');

  if (comment.author.toString() === userId) {
    return comment;
  }

  throw new GraphQLError('You are not allowed to edit this comment');
}

export const updateCommentByContent = async (_: unknown,  { _id,input ,userId}: { _id: string,  userId: string,input: UpdateCommentInput },) => {
  validateInput(input);
  validateId(_id);

  try {
    await checkAuthor(_id, userId);
    const updatedComment = await Comment.findByIdAndUpdate(_id, { content: input.content }, { new: true });
    validateUpdatedComment(updatedComment);
    return updatedComment;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update comment by content:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
