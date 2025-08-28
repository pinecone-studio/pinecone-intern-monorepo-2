import { Story, type StorySchemaType } from 'src/models/story';
import { HydratedDocument } from 'mongoose';
import { GraphQLError } from 'graphql';

interface getStoryByUserIdArgs {
  author: string;
}

interface Context {
  user?: {
    id: string;
    username: string;
  };
}

type StoryDocument = HydratedDocument<StorySchemaType>;

const validateAuthorId = (author: string): void => {
  if (!author) {
    throw new GraphQLError('Author ID is required');
  }

  if (!author.trim()) {
    throw new GraphQLError('Author ID cannot be empty');
  }

  const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!ObjectIdRegex.test(author)) {
    throw new GraphQLError('Invalid author ID format');
  }
};

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }

  throw new GraphQLError('Failed to fetch stories by user ID' + (error instanceof Error ? `: ${error.message}` : ': Unknown error'));
};

export const getStoryByUserId = async (_: unknown, { author }: getStoryByUserIdArgs, _context: Context): Promise<StoryDocument[]> => {
  try {
    validateAuthorId(author);

    const stories = await Story.find({
      author,
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: new Date() } }],
    })
      .populate('author', 'username avatar email isVerified')
      .populate('viewers', 'username avatar')
      .sort({ createdAt: -1 })
      .lean();

    return stories as StoryDocument[];
  } catch (error) {
    return handleError(error);
  }
};
