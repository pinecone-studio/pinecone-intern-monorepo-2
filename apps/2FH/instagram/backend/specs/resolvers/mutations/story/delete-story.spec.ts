import { deleteStory } from "src/resolvers/mutations";
import { Story } from "src/models";
import { GraphQLError } from "graphql";

jest.mock("src/models", () => ({
  Story: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("deleteStory", () => {
  const mockContext = { userId: "user123" };
  const storyId = "story1";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a story successfully", async () => {
    const mockStory = { 
      id: storyId, 
      author: { toString: () => mockContext.userId }
    };
    (Story.findById as jest.Mock).mockResolvedValue(mockStory);
    (Story.findByIdAndDelete as jest.Mock).mockResolvedValue(mockStory);

    const result = await deleteStory(null, { _id: storyId }, mockContext);
    
    expect(Story.findById).toHaveBeenCalledWith(storyId);
    expect(Story.findByIdAndDelete).toHaveBeenCalledWith(storyId);
    expect(result).toBe(true);
  });

  it("returns false when deletion fails (findByIdAndDelete returns null)", async () => {
    const mockStory = { 
      id: storyId, 
      author: { toString: () => mockContext.userId }
    };
    (Story.findById as jest.Mock).mockResolvedValue(mockStory);
    (Story.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await deleteStory(null, { _id: storyId }, mockContext);
    
    expect(Story.findById).toHaveBeenCalledWith(storyId);
    expect(Story.findByIdAndDelete).toHaveBeenCalledWith(storyId);
    expect(result).toBe(false);
  });

  it("throws error if user is not authenticated", async () => {
    await expect(deleteStory(null, { _id: storyId }, { userId: "" }))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, { userId: "" }))
      .rejects.toThrow("User is not authenticated");
  });

  it("throws error if story ID is missing", async () => {
    await expect(deleteStory(null, { _id: "" }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: "" }, mockContext))
      .rejects.toThrow("Story ID is required");
  });

  it("throws error if story ID is only whitespace", async () => {
    await expect(deleteStory(null, { _id: "   " }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: "   " }, mockContext))
      .rejects.toThrow("Story ID is required");
  });

  it("throws error if story not found", async () => {
    (Story.findById as jest.Mock).mockResolvedValue(null);

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Story not found");
  });

  it("throws error if user is not the author", async () => {
    const mockStory = { 
      id: storyId, 
      author: { toString: () => "otherUser" }
    };
    (Story.findById as jest.Mock).mockResolvedValue(mockStory);

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Not authorized to delete this story");
  });

  it("re-throws GraphQLError without modification", async () => {
    const originalError = new GraphQLError("Original GraphQL error");
    (Story.findById as jest.Mock).mockRejectedValue(originalError);

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Original GraphQL error");
  });

  it("throws GraphQLError for unexpected Error instances", async () => {
    (Story.findById as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Failed to delete story: DB connection failed");
  });

  it("throws GraphQLError for non-Error instances", async () => {
    // This covers the "Unknown error" branch in the ternary operator
    (Story.findById as jest.Mock).mockRejectedValue("String error");

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Failed to delete story: Unknown error");
  });

  it("handles null/undefined errors", async () => {
    (Story.findById as jest.Mock).mockRejectedValue(null);

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Failed to delete story: Unknown error");
  });

  it("handles findByIdAndDelete rejection", async () => {
    const mockStory = { 
      id: storyId, 
      author: { toString: () => mockContext.userId }
    };
    (Story.findById as jest.Mock).mockResolvedValue(mockStory);
    (Story.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error("Delete operation failed"));

    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow(GraphQLError);
    await expect(deleteStory(null, { _id: storyId }, mockContext))
      .rejects.toThrow("Failed to delete story: Delete operation failed");
  });
});