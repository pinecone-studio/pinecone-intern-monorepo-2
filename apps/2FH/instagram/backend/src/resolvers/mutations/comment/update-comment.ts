import { GraphQLError } from "graphql";
import { Comment } from "src/models";

interface UpdateCommentInput {
  content: string;
}

// input validate
function validateInput(input: UpdateCommentInput) {
  if (!input.content) {
    throw new GraphQLError("content is empty");
  }
}

// id validate
function validateId(_id: string) {
  if (!_id || _id.trim() === "") {
    throw new GraphQLError("Id is not found");
  }
}

// updated comment validate
function validateUpdatedComment(updatedComment: unknown) {
  if (!updatedComment) {
    throw new GraphQLError("not found Updated comment");
  }
}

export const updateComment = async (
  _: unknown,
  _id: string,
  { input }: { input: UpdateCommentInput }
) => {
  validateInput(input);
  validateId(_id);

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      _id,
      { content: input.content },
      { new: true }
    );

    validateUpdatedComment(updatedComment);

    return updatedComment;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;

    throw new GraphQLError(
      "Failed to update comment:" +
        (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
};








