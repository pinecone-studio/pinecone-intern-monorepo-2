import { viewStory } from "src/resolvers/mutations";
import { Story } from "src/models";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

jest.mock("src/models", () => ({
  Story: {
    findById: jest.fn(),
  },
}));

const mockStory = Story as jest.Mocked<typeof Story>;

describe("viewStory mutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully view a story with valid input", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };

    const mockStoryDoc = {
      _id: new Types.ObjectId(storyId),
      viewers: [],
      save: jest.fn().mockResolvedValue(undefined),
    };

    mockStory.findById.mockResolvedValue(mockStoryDoc as any);

    const result = await viewStory(undefined, { _id: storyId }, context);

    expect(mockStory.findById).toHaveBeenCalledWith(storyId);
    expect(mockStoryDoc.viewers).toHaveLength(1);
    expect(mockStoryDoc.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockStoryDoc);
  });

  it("should not add duplicate viewer if user already viewed the story", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };
    const userObjectId = new Types.ObjectId(userId);

    const mockStoryDoc = {
      _id: new Types.ObjectId(storyId),
      viewers: [userObjectId],
      save: jest.fn(),
    };

    mockStory.findById.mockResolvedValue(mockStoryDoc as any);

    const result = await viewStory(undefined, { _id: storyId }, context);

    expect(mockStoryDoc.viewers).toHaveLength(1);
    expect(mockStoryDoc.save).not.toHaveBeenCalled();
    expect(result).toEqual(mockStoryDoc);
  });

  it("should throw GraphQLError when userId is missing from context", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const context = { userId: "" };

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.findById).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError when userId is undefined", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const context = { userId: undefined as any };

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("User is not authenticated")
    );
    expect(mockStory.findById).not.toHaveBeenCalled();
  });

  it("should throw GraphQLError when story is not found", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };

    mockStory.findById.mockResolvedValue(null);

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("Story not found")
    );
    expect(mockStory.findById).toHaveBeenCalledWith(storyId);
  });

  it("should re-throw GraphQLError from Story.findById", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };
    const originalError = new GraphQLError("Database connection failed");

    mockStory.findById.mockRejectedValue(originalError);

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(originalError);
    expect(mockStory.findById).toHaveBeenCalledWith(storyId);
  });

  it("should wrap generic Error from Story.findById in GraphQLError", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };
    const originalError = new Error("Database timeout");

    mockStory.findById.mockRejectedValue(originalError);

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("Failed to view story: Database timeout")
    );
    expect(mockStory.findById).toHaveBeenCalledWith(storyId);
  });

  it("should handle non-Error exceptions from Story.findById", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };
    const originalError = "String error";

    mockStory.findById.mockRejectedValue(originalError);

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("Failed to view story: Unknown error")
    );
    expect(mockStory.findById).toHaveBeenCalledWith(storyId);
  });

  it("should handle save operation failure", async () => {
    const storyId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const context = { userId };
    const saveError = new Error("Save operation failed");

    const mockStoryDoc = {
      _id: new Types.ObjectId(storyId),
      viewers: [],
      save: jest.fn().mockRejectedValue(saveError),
    };

    mockStory.findById.mockResolvedValue(mockStoryDoc as any);

    await expect(viewStory(undefined, { _id: storyId }, context)).rejects.toThrow(
      new GraphQLError("Failed to view story: Save operation failed")
    );
    expect(mockStoryDoc.save).toHaveBeenCalledTimes(1);
  });
});