import { GraphQLError } from 'graphql';
import { HydratedDocument } from 'mongoose';
import { Story, StorySchemaType } from 'src/models';

type StoryDocument = HydratedDocument<StorySchemaType>;

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError('Failed to fetch all stories' + (error instanceof Error ? `:${error.message}` : ':unknown error'));
};

export const getActiveStories = async (): Promise<StoryDocument[]> => {
  try {
    const stories = await Story.find().populate('author', 'userName profileImage email isVerified').populate('viewers', 'userName profileImage').sort({ createdAt: -1 }).lean();
    return stories as StoryDocument[];
  } catch (error) {
    return handleError(error);
  }
};
