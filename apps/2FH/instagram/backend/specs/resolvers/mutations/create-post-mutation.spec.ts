import { PostModel } from "src/models";
import { createPost } from "src/resolvers/mutations/post-mutation/create-post-mutation";

jest.mock("src/models", () => ({
  PostModel: {
    create: jest.fn(),
  },
}));

describe("createPost resolver", () => {
  const author = "123";
  const image = ["img1.jpg"];
  const caption = "Hello";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a post successfully", async () => {
    const fakePost = { _id: "1", author, image, caption };
    (PostModel.create as jest.Mock).mockResolvedValue(fakePost);

    const result = await createPost
    ({}, author, image, caption);
    expect(PostModel.create).toHaveBeenCalledWith({ author, image, caption });
    expect(result).toEqual(fakePost);
  });

  it("should throw error if author is empty", async () => {
    await expect(createPost({}, "", image, caption)).rejects.toThrow("user not found");
  });

  it("should throw error if image array is empty", async () => {
    await expect(createPost({}, author, [], caption)).rejects.toThrow("images not found");
  });
  it("should throw unknown error if non-Error is caught", async () => {
    // PostModel.create-г mock хийж, non-Error object throw хийлгэх
    (PostModel.create as jest.Mock).mockImplementation(() => {
      throw "Some string error"; // instanceof Error биш
    });
  
    await expect(createPost({}, author, image, caption)).rejects.toThrow("Unknown error");
  });
  
  
});
