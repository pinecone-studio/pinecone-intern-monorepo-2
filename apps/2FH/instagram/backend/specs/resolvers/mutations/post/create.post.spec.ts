
import { createPost } from "src/resolvers/mutations/post-mutation/create-post";
import { PostModel } from "src/models";

jest.mock("src/models", () => ({
  PostModel: {
    create: jest.fn(),
  },
}));

describe("createPost resolver", () => {
  const author = "user123";
  const image = ["img1.jpg"];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a post successfully", async () => {
    const mockPost = { author, image, caption: "Test caption" };
    (PostModel.create as jest.Mock).mockResolvedValue(mockPost);

    const result = await createPost({}, author, image, "Test caption");
    expect(result).toEqual(mockPost);
    expect(PostModel.create).toHaveBeenCalledWith({ author, image, caption: "Test caption" });
  });

  it("should catch unknown errors thrown by PostModel.create", async () => {
    (PostModel.create as jest.Mock).mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await expect(createPost({}, author, image, "Test caption")).rejects.toThrow("Failed to create post: DB error");
  });

  it("should catch unknown errors thrown as string", async () => {
    (PostModel.create as jest.Mock).mockImplementationOnce(() => {
      throw "some string";
    });

    await expect(createPost({}, author, image, "Test caption")).rejects.toThrow("Failed to create post: \"some string\"");
  });
  it("should throw GraphQLError if author are missing (validatePost)", async () => {
    await expect(createPost({}, "", image)).rejects.toThrow("User not found");
  });
  

  it("should throw GraphQLError if images are missing (validatePost)", async () => {
    await expect(createPost({}, author, [])).rejects.toThrow("Images not found");
  });

  it("should catch unknown errors thrown as object", async () => {
    const unknownError = { message: "DB error", code: 123 };
    (PostModel.create as jest.Mock).mockImplementationOnce(() => {
      throw unknownError;
    });

    await expect(createPost({}, author, image, "Test caption")).rejects.toThrow(
      "Failed to create post: " + JSON.stringify(unknownError)
    );
  });
});
 