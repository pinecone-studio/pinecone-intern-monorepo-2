import { GraphQLError } from "graphql";
import { PostModel } from "src/models";

const validatePost = (author: string, image: string[]) => {
  if (!author) throw new GraphQLError("User not found");
  if (!image || image.length === 0) throw new GraphQLError("Images not found");
};

export const createPost = async (_: unknown, author: string, image: string[], caption?: string) => {
  try {
    validatePost(author, image);
    const post = await PostModel.create({ author, image, caption });
    return post;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError(
      "Failed to create post: " + (error instanceof Error ? error.message : JSON.stringify(error))
    );
  }
};
