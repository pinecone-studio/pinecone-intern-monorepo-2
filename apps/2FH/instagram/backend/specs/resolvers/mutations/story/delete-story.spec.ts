import { deleteStory } from "src/resolvers/mutations/story/delete-story";
import { Story } from "src/models";
import { GraphQLError } from "graphql";

jest.mock("src/models", () => ({
  Story: { findById: jest.fn(), findByIdAndDelete: jest.fn() },
}));

const mockStory = Story as jest.Mocked<typeof Story>;

describe("deleteStory mutation", () => {
  beforeEach(() => jest.clearAllMocks());

  const ctx = { user: { id: "testuser" } };
  const story = { _id: "story123", author: { toString: () => "testuser" } };

  const expectNoDbCalls = () => {
    expect(mockStory.findById).not.toHaveBeenCalled();
    expect(mockStory.findByIdAndDelete).not.toHaveBeenCalled();
  };

  it("should successfully delete a story", async () => {
    mockStory.findById.mockResolvedValue(story as any);
    mockStory.findByIdAndDelete.mockResolvedValue(story as any);

    const result = await deleteStory(undefined, { _id: "story123" }, ctx);

    expect(mockStory.findById).toHaveBeenCalledWith("story123");
    expect(mockStory.findByIdAndDelete).toHaveBeenCalledWith("story123");
    expect(result).toBe(true);
  });

  it("should return false when deletion fails", async () => {
    mockStory.findById.mockResolvedValue(story as any);
    mockStory.findByIdAndDelete.mockResolvedValue(null);

    const result = await deleteStory(undefined, { _id: "story123" }, ctx);
    expect(result).toBe(false);
  });

  describe("validation errors", () => {
    it.each([
      ["user undefined", { user: undefined }],
      ["empty context", {}],
      ["empty user id", { user: { id: "" } }]
    ])("should throw when %s", async (_, context) => {
      await expect(
        deleteStory(undefined, { _id: "story123" }, context as any)
      ).rejects.toThrow(new GraphQLError("User is not authenticated"));
      expectNoDbCalls();
    });

    it.each([
      ["empty string", ""],
      ["undefined", undefined],
      ["null", null],
      ["whitespace", "   "]
    ])("should throw when story ID is %s", async (_, id) => {
      await expect(
        deleteStory(undefined, { _id: id as any }, ctx)
      ).rejects.toThrow(new GraphQLError("Story ID is required"));
      expectNoDbCalls();
    });
  });

  it("should throw when story not found", async () => {
    mockStory.findById.mockResolvedValue(null);

    await expect(
      deleteStory(undefined, { _id: "nonexistent123" }, ctx)
    ).rejects.toThrow(new GraphQLError("Story not found"));

    expect(mockStory.findById).toHaveBeenCalledWith("nonexistent123");
    expect(mockStory.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it("should throw when user not authorized", async () => {
    const unauthorizedStory = { ...story, author: { toString: () => "otheruser" } };
    mockStory.findById.mockResolvedValue(unauthorizedStory as any);
    
    await expect(
      deleteStory(undefined, { _id: "story123" }, ctx)
    ).rejects.toThrow(new GraphQLError("Not authorized to delete this story"));

    expect(mockStory.findById).toHaveBeenCalledWith("story123");
    expect(mockStory.findByIdAndDelete).not.toHaveBeenCalled();
  });

  describe("error handling", () => {
    it("should handle findById GraphQLError", async () => {
      const error = new GraphQLError("DB error");
      mockStory.findById.mockRejectedValue(error);
      
      await expect(
        deleteStory(undefined, { _id: "story123" }, ctx)
      ).rejects.toThrow(error);
    });

    it("should handle findByIdAndDelete GraphQLError", async () => {
      const error = new GraphQLError("DB error");
      mockStory.findById.mockResolvedValue(story as any);
      mockStory.findByIdAndDelete.mockRejectedValue(error);
      
      await expect(
        deleteStory(undefined, { _id: "story123" }, ctx)
      ).rejects.toThrow(error);
    });

    it("should handle generic Error with message wrapping", async () => {
      const error = new Error("timeout");
      mockStory.findById.mockRejectedValue(error);
      
      await expect(
        deleteStory(undefined, { _id: "story123" }, ctx)
      ).rejects.toThrow(new GraphQLError("Failed to delete story: timeout"));
    });

    it("should handle unknown error types", async () => {
      mockStory.findById.mockRejectedValue("string error");
      
      await expect(
        deleteStory(undefined, { _id: "story123" }, ctx)
      ).rejects.toThrow(new GraphQLError("Failed to delete story: Unknown error"));
    });
  });

  it("should handle user authentication check after story exists", async () => {
    const contextWithoutUser = { user: undefined };
    mockStory.findById.mockResolvedValue(story as any);

    await expect(
      deleteStory(undefined, { _id: "story123" }, contextWithoutUser)
    ).rejects.toThrow(new GraphQLError("User is not authenticated"));
  });
});