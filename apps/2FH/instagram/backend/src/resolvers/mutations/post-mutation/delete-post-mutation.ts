import { PostModel } from "src/models"

export const deletePost = async (_: unknown, _id: string) => {
    try{  
        const deletedPost = await PostModel.findByIdAndDelete({ _id: _id });
        if(!_id){
            throw new Error("Post is not found")
        }
    return deletedPost;
}
    catch (error){
            throw new Error(error instanceof Error ? error.message : "Unknown error");
         }
};