import { Comment } from "src/models";
import { createComment } from "src/resolvers/mutations/comment-mutations/create-comment";

jest.mock("src/models",()=>({
    Comment : {
        create: jest.fn()
    }
}));

describe("createComment resolver",()=>{
const author="123";
const postId="456";
const content="this comment for mock test"
 afterEach(()=>{
    jest.clearAllMocks()
 });
 it("should create a comment successfully", async()=>{
    const mockComment={author,postId, content };
    (Comment.create as jest.Mock).mockResolvedValue(mockComment);
    const args = { input: { author, postId, content } };
    const result = await createComment({}, args);
    expect(Comment.create).toHaveBeenCalledWith({ author, postId, content });
    expect(result).toEqual(mockComment);
});
it("should throw GraphqlError if author is missing (validateInput)", async () => {
    const args = { input: { author: "", postId, content } };
    await expect(createComment({}, args)).rejects.toThrow("User is not authenticated");
});
it("should throw GraphqlError if postId is missing (validateInput)", async () => {
    const args = { input: { author, postId:"", content } };
    await expect(createComment({}, args)).rejects.toThrow("postId is required!");
});
it("should throw GraphqlError if content is empty (validateInput)", async () => {
    const args = { input: { author, postId, content:"" } };
    await expect(createComment({}, args)).rejects.toThrow("content is empty");
});
it("should catch unknown errors thrown as object", async () => {
    const unknownError = { message: "DB error", code: 123 };
    (Comment.create as jest.Mock).mockImplementationOnce(() => {
      throw unknownError;
    });
    const args = { input: { author, postId, content } };
    await expect(createComment({}, args)).rejects.toThrow(
      "Failed to create comment:"+JSON.stringify(unknownError)
    );
  });
  it("should catch unknown errors thrown as real Error instance", async () => {
    const realError = new Error("Real DB failure")
    ;(Comment.create as jest.Mock).mockImplementationOnce(() => {
      throw realError
    })
  
    const args = { input: { author, postId, content } }
    await expect(createComment({}, args)).rejects.toThrow(
      "Failed to create comment:Real DB failure"
    )
  })
})