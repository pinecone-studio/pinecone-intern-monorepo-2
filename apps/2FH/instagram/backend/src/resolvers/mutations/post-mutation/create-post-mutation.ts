import { PostModel } from "src/models";

const validatePost = (author: string, image: string[]) => {
    if (!author) throw new Error("user not found");
    if (!image.length) throw new Error("images not found");
  };
  
  export const createPost = async (_: unknown, author:string, image:string[], caption?:string) => {
    try {
      validatePost(author, image);
  
      const post = await PostModel.create({ author, image, caption });
      return post;
    } catch (error) {
      console.error("createPost Error:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };
  