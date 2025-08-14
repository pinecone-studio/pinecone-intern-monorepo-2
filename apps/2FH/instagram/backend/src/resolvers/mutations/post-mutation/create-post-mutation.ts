import { GraphQLError } from "graphql";
import { PostModel } from "src/models";

const validatePost = (author: string, image: string[]) => {
    if (!author) throw new GraphQLError("user not found");
    if (!image.length) throw new GraphQLError("images not found");
  };
  
  export const createPost = async (_: unknown, author:string, image:string[], caption?:string) => {
    try {
      validatePost(author, image);
      const post = await PostModel.create({ author, image, caption });
      return post;
    } catch (error) {
      throw new GraphQLError(
        error instanceof GraphQLError ? error.message : "Unknown error"
      );
    }
  };