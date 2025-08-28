import { Story } from "src/models";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";

interface ViewStoryInput {
  _id: string;
  userId: string;
}

interface StoryDocument {
  _id: Types.ObjectId;
  viewers: Types.ObjectId[];
  save(): Promise<StoryDocument>;
}

interface Viewer {
  equals(_other: Types.ObjectId): boolean;
}

const validateViewInput = (input: ViewStoryInput): void => {
  if (!input.userId) {
    throw new GraphQLError("User is not authenticated");
  }
};

const checkStoryExists = async (storyId: string): Promise<StoryDocument> => {
  const story = await Story.findById(storyId);
  if (!story) {
    throw new GraphQLError("Story not found");
  }
  return story as StoryDocument;
};

const updateStoryViewers = async (story: StoryDocument, userId: string): Promise<StoryDocument> => {
  const userObjectId = new Types.ObjectId(userId);
  
  if (!story.viewers.some((viewer: Viewer) => viewer.equals(userObjectId))) {
    story.viewers.push(userObjectId);
    await story.save();
  }
  
  return story;
};

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  
  throw new GraphQLError(
    "Failed to view story: " + (error instanceof Error ? error.message : "Unknown error")
  );
};

export const viewStory = async (
  _: unknown,
  { _id }: { _id: string },
  context: { userId: string }
) => {
  try {
    const userId = context.userId;
    
    validateViewInput({ _id, userId });
    
    const story = await checkStoryExists(_id);
    
    return await updateStoryViewers(story, userId);
  } catch (error) {
    handleError(error);
  }
};
