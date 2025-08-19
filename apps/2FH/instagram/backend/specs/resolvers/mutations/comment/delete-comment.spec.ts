import { Comment } from "src/models";
import { deleteComment } from "src/resolvers/mutations/comment-mutations/delete-comment";

 jest.mock("src/models", ()=>({
    Comment:{
    findByIdAndDelete:jest.fn()}
 }))
  describe("deleteComment resolver",()=>{
    const mockId="123abc";
    afterEach(() => {
        jest.clearAllMocks();
      });
it("should throw GraphqlError if Id is empty", async ()=>{
    await expect(deleteComment({},"")).rejects.toThrow("Id is not found");
});
it("should throw GraphQLError if comment does not exist", async ()=>{
    (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(deleteComment({},mockId)).rejects.toThrow("not found deleted comment");
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
})
it("should return delete comment successfully", async()=>{
    const mockComment={mockId,content:"this comment for delete comment mock"};
    (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(mockComment);
    const result= await deleteComment({},mockId);
     expect(result).toEqual(mockComment);
     expect(Comment.findByIdAndDelete).toHaveBeenCalledWith({_id:mockId})
});
it("should catch unknown errors thrown by PostModel.findByIdAndDelete (Error)", async () => {
    (Comment.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    await expect(deleteComment({}, mockId)).rejects.toThrow("Failed to delete comment:DB error");
  });

  it("should catch unknown errors thrown by PostModel.findByIdAndDelete (string)", async () => {
    (Comment.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw "some string";
    });
    await expect(deleteComment({}, mockId)).rejects.toThrow("Failed to delete comment:\"some string\"");
  });


  })