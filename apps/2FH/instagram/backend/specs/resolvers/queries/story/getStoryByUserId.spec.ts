import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { Story } from 'src/models/story';
import { getStoryByUserId } from 'src/resolvers/queries/story/get-story-by-user-id';

jest.mock('src/models/story');

describe('getStoryByUserId', () => {
  const mockUser = {
    id: new Types.ObjectId().toString(),
    username: 'testuser',
  };

  const mockContext = { user: mockUser };

  const baseStory = {
    _id: new Types.ObjectId(),
    author: {
      _id: new Types.ObjectId(mockUser.id),
      username: 'testuser',
      avatar: 'avatar.jpg',
      email: 'user@example.com',
      isVerified: true,
    },
    viewers: [],
    createdAt: new Date(),
  };

  const mockStoryFind = (returnValue: any) => {
    (Story.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(returnValue),
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should throw error if author ID is missing', async () => {
    await expect(getStoryByUserId({}, { author: '' }, mockContext)).rejects.toThrow(new GraphQLError('Author ID is required'));
  });

  it('should throw error if author ID is only spaces', async () => {
    await expect(getStoryByUserId({}, { author: '   ' }, mockContext)).rejects.toThrow(new GraphQLError('Author ID cannot be empty'));
  });

  it('should throw error if author ID is invalid format', async () => {
    await expect(getStoryByUserId({}, { author: 'invalid123' }, mockContext)).rejects.toThrow(new GraphQLError('Invalid author ID format'));
  });

  it('should return active stories for valid author', async () => {
    const authorId = new Types.ObjectId().toString();
    const storyData = [
      {
        ...baseStory,
        author: {
          _id: new Types.ObjectId(authorId),
          username: 'user',
          avatar: 'avatar.png',
          email: 'user@email.com',
          isVerified: true,
        },
        expiredAt: new Date(Date.now() + 10000),
      },
    ];

    mockStoryFind(storyData);

    const result = await getStoryByUserId({}, { author: authorId }, mockContext);
    expect(result).toEqual(storyData);
    expect(Story.find).toHaveBeenCalledWith({
      author: authorId,
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: expect.any(Date) } }],
    });
  });

  it('should handle GraphQLError and rethrow it', async () => {
    const authorId = new Types.ObjectId().toString();
    const graphqlError = new GraphQLError('Custom GraphQL Error');

    (Story.find as jest.Mock).mockImplementation(() => {
      throw graphqlError;
    });

    await expect(getStoryByUserId({}, { author: authorId }, mockContext)).rejects.toThrow(graphqlError);
  });

  it('should handle regular Error and wrap it', async () => {
    const authorId = new Types.ObjectId().toString();
    const regularError = new Error('Database connection failed');

    (Story.find as jest.Mock).mockImplementation(() => {
      throw regularError;
    });

    await expect(getStoryByUserId({}, { author: authorId }, mockContext)).rejects.toThrow(new GraphQLError('Failed to fetch stories by user ID: Database connection failed'));
  });

  it('should handle unknown error type', async () => {
    const authorId = new Types.ObjectId().toString();
    const unknownError = 'String error';

    (Story.find as jest.Mock).mockImplementation(() => {
      throw unknownError;
    });

    await expect(getStoryByUserId({}, { author: authorId }, mockContext)).rejects.toThrow(new GraphQLError('Failed to fetch stories by user ID: Unknown error'));
  });

  it('should handle empty stories array', async () => {
    const authorId = new Types.ObjectId().toString();
    mockStoryFind([]);

    const result = await getStoryByUserId({}, { author: authorId }, mockContext);
    expect(result).toEqual([]);
  });
});
