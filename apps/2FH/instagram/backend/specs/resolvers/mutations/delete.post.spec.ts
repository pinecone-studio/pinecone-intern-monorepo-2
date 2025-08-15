import { PostModel } from "src/models";
import { deletePost } from "src/resolvers/mutations/post-mutation/delete.post";

jest.mock("src/models", () => ({
  PostModel: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe("deletePost", () => {
  const mockId = "123abc";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw GraphQLError if _id is empty", async () => {
    await expect(deletePost({}, "")).rejects.toThrow("Id is not found");
  });

  it("should throw GraphQLError if post does not exist", async () => {
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(deletePost({}, mockId)).rejects.toThrow("Post is not found");
    expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
  });

  it("should return the deleted post if it exists", async () => {
    const mockPost = { _id: mockId, title: "Test Post" };
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);
    const result = await deletePost({}, mockId);
    expect(result).toEqual(mockPost);
    expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
  });

  it("should catch unknown errors thrown by PostModel.findByIdAndDelete (Error)", async () => {
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    await expect(deletePost({}, mockId)).rejects.toThrow("Failed to delete post: DB error");
  });

  it("should catch unknown errors thrown by PostModel.findByIdAndDelete (string)", async () => {
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw "some string";
    });
    await expect(deletePost({}, mockId)).rejects.toThrow("Failed to delete post: \"some string\"");
  });

  it("should catch unknown errors thrown by PostModel.findByIdAndDelete (null)", async () => {
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw null;
    });
    await expect(deletePost({}, mockId)).rejects.toThrow("Failed to delete post: null");
  });
});
