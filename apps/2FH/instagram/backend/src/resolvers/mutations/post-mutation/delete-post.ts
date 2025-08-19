import { GraphQLError } from "graphql";
import { PostModel } from "src/models";

function validateId(_id: string) {
  if (!_id || _id.trim() === "") {
    throw new GraphQLError("Id is not found");
  }
}

async function removePostById(_id: string) {
  const deletedPost = await PostModel.findByIdAndDelete({ _id });
  if (!deletedPost) {
    throw new GraphQLError("Post is not found");
  }
  return deletedPost;
}

export const deletePost = async (_: unknown, _id: string) => {
  try {
    validateId(_id);
    return await removePostById(_id);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(
      "Failed to delete post: " +
        (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
};
