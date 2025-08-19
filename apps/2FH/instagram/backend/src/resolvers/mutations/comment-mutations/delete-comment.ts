import { GraphQLError } from "graphql";
import { Comment } from "src/models";

function validateId(_id: string) {
  if (!_id || _id.trim() === "") {
    throw new GraphQLError("Id is not found");
  }
}

function validateDeleted(deletedComment: unknown) {
  if (!deletedComment) {
    throw new GraphQLError("not found deleted comment");
  }
}

export const deleteComment = async (_: unknown, _id: string) => {
  validateId(_id); // id-г шууд шалгах try/catch-аас гадна

  try {
    const deletedComment = await Comment.findByIdAndDelete({_id});
    validateDeleted(deletedComment);
    return deletedComment;
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError(
      "Failed to delete comment:" + (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
};
