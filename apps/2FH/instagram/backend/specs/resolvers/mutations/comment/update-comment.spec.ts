import { Comment } from "src/models";
import { updateComment } from "src/resolvers/mutations/comment/update-comment";

jest.mock("src/models", () => ({
  Comment: {
    findByIdAndUpdate: jest.fn()
  }
}));

describe("updateComment resolver", () => {
  const _id = "comment123";
  const content = "Updated content";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a comment successfully", async () => {
    const mockComment = { _id, content };
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockComment);

    const args = { input: { content } };
    const result = await updateComment({}, _id, args);

    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      { content },
      { new: true }
    );
    expect(result).toEqual(mockComment);
  });

  it("should throw GraphQLError if content is empty", async () => {
    const args = { input: { content: "" } };

    await expect(updateComment({}, _id, args)).rejects.toThrow(
      "content is empty"
    );
  });

  it("should throw GraphQLError if id is missing", async () => {
    const args = { input: { content } };

    await expect(updateComment({}, "", args)).rejects.toThrow("Id is not found");
  });

  it("should throw custom GraphQLError if unknown Error occurs", async () => {
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    const args = { input: { content } };
    await expect(updateComment({}, _id, args)).rejects.toThrow(
      "Failed to update comment:DB error"
    );
  });

  it("should handle non-Error thrown objects", async () => {
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw { custom: "weird error" };
    });

    const args = { input: { content } };
    await expect(updateComment({}, _id, args)).rejects.toThrow(
      /Failed to update comment:/
    );
  });

  it("should throw error if comment not found", async () => {
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const args = { input: { content: "anything" } };
  
    await expect(updateComment({}, _id, args))
      .rejects.toThrow("not found Updated comment");
  });
})
