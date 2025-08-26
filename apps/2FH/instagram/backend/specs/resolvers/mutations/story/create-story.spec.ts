import { createStory } from "src/resolvers/mutations";
import { Story } from "src/models";
import { GraphQLError } from "graphql";

jest.mock("src/models", () => ({
  Story: { create: jest.fn() },
}));

describe("createStory", () => {
  const mockContext = { userId: "user123" };
  const validInput = { image: "http://image.url" };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("creates a story successfully with expiredAt", async () => {
    const mockStory = { 
      id: "story1", 
      author: mockContext.userId, 
      image: validInput.image,
      expiredAt: new Date('2024-01-02T12:00:00Z')
    };
    (Story.create as jest.Mock).mockResolvedValue(mockStory);

    const result = await createStory(null, { input: validInput }, mockContext);
    
    expect(Story.create).toHaveBeenCalledWith({ 
      author: mockContext.userId, 
      image: validInput.image,
      expiredAt: new Date('2024-01-02T12:00:00Z')
    });
    expect(result).toEqual(mockStory);
  });

  it("throws an error if user is not authenticated", async () => {
    await expect(createStory(null, { input: validInput }, { userId: "" }))
      .rejects.toThrow(new GraphQLError("User is not authenticated"));
  });

  it("throws an error if image is missing", async () => {
    await expect(createStory(null, { input: { image: "" } }, mockContext))
      .rejects.toThrow(new GraphQLError("Image is required"));
  });

  it("throws an error if image is only whitespace", async () => {
    await expect(createStory(null, { input: { image: "   " } }, mockContext))
      .rejects.toThrow(new GraphQLError("Image is required"));
  });

  it("re-throws GraphQLError without modification", async () => {
    const originalError = new GraphQLError("Original GraphQL error");
    (Story.create as jest.Mock).mockRejectedValue(originalError);

    await expect(createStory(null, { input: validInput }, mockContext))
      .rejects.toThrow("Original GraphQL error");
  });

  it("throws a GraphQLError for unexpected Error instances", async () => {
    (Story.create as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

    await expect(createStory(null, { input: validInput }, mockContext))
      .rejects.toThrow("Failed to create storyDB connection failed");
  });

  it("throws a GraphQLError for non-Error instances", async () => {
    (Story.create as jest.Mock).mockRejectedValue("String error");

    await expect(createStory(null, { input: validInput }, mockContext))
      .rejects.toThrow("Failed to create storyError");
  });

  it("handles null/undefined errors", async () => {
    (Story.create as jest.Mock).mockRejectedValue(null);

    await expect(createStory(null, { input: validInput }, mockContext))
      .rejects.toThrow("Failed to create storyError");
  });
});