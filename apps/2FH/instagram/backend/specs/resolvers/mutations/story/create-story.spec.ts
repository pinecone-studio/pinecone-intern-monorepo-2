import { createStory } from "src/resolvers/mutations";
import { Story } from "src/models";
import { GraphQLError } from "graphql";

jest.mock("src/models", () => ({
  Story: {
    create: jest.fn(),
  },
}));

const mockStory = Story as jest.Mocked<typeof Story>;

describe("createStory mutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should successfully create a story with valid input", async () => {
    const input = {
      author: "testuser",
      image: "https://example.com/image.jpg",
    };
    const expectedStory = {
      id: "1",
      author: "testuser",
      image: "https://example.com/image.jpg",
      createdAt: new Date(),
    };
    mockStory.create.mockResolvedValue(expectedStory as any);
    const result = await createStory(undefined, { input });
    expect(mockStory.create).toHaveBeenCalledWith({
      author: "testuser",
      image: "https://example.com/image.jpg",
    });
    expect(mockStory.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedStory);
  });
  it("should throw GraphQLError when author is missing", async () => {
    const input = {
      author: "",
      image: "https://example.com/image.jpg",
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should throw GraphQLError when author is undefined", async () => {
    const input = {
      author: undefined as any,
      image: "https://example.com/image.jpg",
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should throw GraphQLError when image is missing", async () => {
    const input = {
      author: "testuser",
      image: "",
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("Image is required")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should throw GraphQLError when image is undefined", async () => {
    const input = {
      author: "testuser",
      image: undefined as any,
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("Image is required")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should throw GraphQLError when both author and image are missing", async () => {
    const input = {
      author: "",
      image: "",
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should re-throw GraphQLError from Story.create", async () => {
    const input = {
      author: "testuser",
      image: "https://example.com/image.jpg",
    };
    const originalError = new GraphQLError("Database connection failed");
    mockStory.create.mockRejectedValue(originalError);
    await expect(createStory(undefined, { input })).rejects.toThrow(originalError);
    expect(mockStory.create).toHaveBeenCalledWith({
      author: "testuser",
      image: "https://example.com/image.jpg",
    });
  });
  it("should wrap generic Error from Story.create in GraphQLError", async () => {
    const input = {
      author: "testuser",
      image: "https://example.com/image.jpg",
    };
    const originalError = new Error("Database timeout");
    mockStory.create.mockRejectedValue(originalError);
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("Failed to create storyDatabase timeout")
    );
    expect(mockStory.create).toHaveBeenCalledWith({
      author: "testuser",
      image: "https://example.com/image.jpg",
    });
  });
  it("should handle non-Error exceptions from Story.create", async () => {
    const input = {
      author: "testuser",
      image: "https://example.com/image.jpg",
    };
    const originalError = "String error";
    mockStory.create.mockRejectedValue(originalError);
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("Failed to create storyError")
    );
    expect(mockStory.create).toHaveBeenCalledWith({
      author: "testuser",
      image: "https://example.com/image.jpg",
    });
  });
  it("should handle null values in input", async () => {
    const input = {
      author: null as any,
      image: null as any,
    };
    await expect(createStory(undefined, { input })).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.create).not.toHaveBeenCalled();
  });
  it("should trim whitespace and reject empty author", async () => {
    const input = {
      author: "   ",
      image: "https://example.com/image.jpg",
    };
    const expectedStory = {
      id: "1",
      author: "   ",
      image: "https://example.com/image.jpg",
    };
    mockStory.create.mockResolvedValue(expectedStory as any);
    const result = await createStory(undefined, { input });
    expect(result).toEqual(expectedStory);
  });
});