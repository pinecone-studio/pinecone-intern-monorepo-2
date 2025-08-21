import { Story } from 'src/models/story';
import { GraphQLError } from 'graphql';
import { Types, HydratedDocument } from 'mongoose';
import type { StorySchemaType } from 'src/models/story';

interface GetStoryByIdArgs {
  _id: string;
}

interface Context {
  user?: {
    id: string;
    username: string;
  };
}

type StoryDocument = HydratedDocument<StorySchemaType>;

const validateStoryId = (storyId: string): void => {
  if (!storyId) {
    throw new GraphQLError('Story ID is required');
  }
};

const isStoryExpired = (story: StoryDocument): boolean => {
  if (!story.expiredAt) return false;
  return new Date() > story.expiredAt;
};

const isPopulatedViewer = (viewer: any): boolean => {
  return viewer && typeof viewer === 'object' && '_id' in viewer;
};

const compareViewerIds = (viewer: any, userId: Types.ObjectId, userIdString: string): boolean => {
  if (isPopulatedViewer(viewer)) {
    return viewer._id.equals(userId);
  }
  return viewer.equals ? viewer.equals(userId) : viewer.toString() === userIdString;
};

const checkViewerExists = (viewers: any[], userId: Types.ObjectId, userIdString: string): boolean => {
  return viewers.some((viewer) => compareViewerIds(viewer, userId, userIdString));
};

const handleViewerLogic = async (story: StoryDocument, context: Context): Promise<void> => {
  if (!context.user) return;

  const userId = new Types.ObjectId(context.user.id);
  const isAuthor = story.author._id.equals(userId);

  if (isAuthor) return;

  const hasViewed = checkViewerExists(story.viewers, userId, context.user.id);

  if (!hasViewed) {
    story.viewers.push(userId);
    await story.save();
  }
};

export const getStoryById = async (_: unknown, { _id }: GetStoryByIdArgs, context: Context): Promise<StoryDocument> => {
  validateStoryId(_id);

  const story = await Story.findById(_id).populate('author', 'username avatar email bio isVerified').populate('viewers', 'username avatar');

  if (!story) {
    throw new GraphQLError('Story not found');
  }

  if (isStoryExpired(story)) {
    throw new GraphQLError('Story has expired');
  }

  await handleViewerLogic(story, context);

  return story;
};
