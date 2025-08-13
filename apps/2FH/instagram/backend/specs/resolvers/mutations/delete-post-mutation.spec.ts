import { PostModel } from "src/models";
import { deletePost } from "src/resolvers/mutations/post-mutation/delete-post-mutation";

jest.mock("src/models",()=>({
    PostModel:{
        findByIdAndDelete: jest.fn(),
    },
}));
 describe("deletePost resolver",()=>{
    const _id="123"
     
    beforeEach(()=>{
        jest.clearAllMocks();
    });
     it("should be delete a post successfully", async()=>{
        const fakeDeletedPost={_id:"123"};
        (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(fakeDeletedPost);

        const result= await deletePost
        ({},_id);
        expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({_id});
        expect(result).toEqual(fakeDeletedPost);
     });
     it("should throw error if ID is wrong or undefined", async()=>{
        await expect(deletePost({},"")).rejects.toThrow("Post is not found")
     })
     it("should reject deletePost if PostModel.findByIdAndDelete fails", async () => {
        const _id = "123";
        (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
            throw "some string"; // instanceof Error биш
          });
        await expect(deletePost({}, _id)).rejects.toThrow("Unknown error")
      });
      

 })