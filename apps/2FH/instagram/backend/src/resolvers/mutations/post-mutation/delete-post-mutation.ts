import { GraphQLError } from "graphql";
import { PostModel } from "src/models"

export const deletePost = async (_: unknown, _id: string) => {
    try{  
        const deletedPost = await PostModel.findByIdAndDelete({ _id: _id });
        if(!_id){
            throw new GraphQLError("Post is not found")
        }
    return deletedPost;
}
    catch (error){
        throw new GraphQLError(error instanceof GraphQLError ? error.message : "Unknown error");
         }
};