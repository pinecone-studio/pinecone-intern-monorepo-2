/* eslint-disable max-lines */
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { Story } from 'src/models/story';
import { getStoryByUserId } from 'src/resolvers/queries/story/get-story-by-user-id';

jest.mock('src/models/story');

describe('getStoryByUserId', () => {
  const mockUser = { id: new Types.ObjectId().toString(), username: 'testuser' };
  const mockContext = { user: mockUser };

  const baseStory = {
    _id: new Types.ObjectId(),
    author: { _id: new Types.ObjectId(mockUser.id), username: 'testuser', profileImage: 'avatar.jpg' },
    viewers: [],
    createdAt: new Date(),
  };

  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const expectGraphQLError = async (fn: () => Promise<any>, message: string) => {
    try {
      await fn();
      throw new Error('Expected GraphQLError but none thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe(message);
    }
  };

  const mockStoryFind = (returnValue: unknown) => {
    const lean = jest.fn().mockResolvedValue(returnValue);
    const sort = jest.fn().mockReturnValue({ lean });
    const populateViewers = jest.fn().mockReturnValue({ sort });
    const populateAuthor = jest.fn().mockReturnValue({ populate: populateViewers });
    (Story.find as jest.Mock).mockReturnValue({ populate: populateAuthor });
    return { populateAuthor, populateViewers, sort, lean };
  };

  it('should return stories for valid author', async () => {
    const authorId = new Types.ObjectId().toString();
    const storyData = [{ ...baseStory, author: { _id: new Types.ObjectId(authorId), username: 'user', profileImage: 'avatar.png' }, image: 'story.jpg', createdAt: new Date() }];
    const { populateAuthor, populateViewers, sort, lean } = mockStoryFind(storyData);

    const result = await getStoryByUserId({}, { author: authorId }, mockContext);

    expect(result).toEqual(storyData);
    expect(Story.find).toHaveBeenCalledWith({ author: authorId });
    expect(populateAuthor).toHaveBeenCalledWith('author', 'userName profileImage email isVerified');
    expect(populateViewers).toHaveBeenCalledWith('viewers', 'userName avatar');
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(lean).toHaveBeenCalled();
  });

  it('should return empty array when no stories', async () => {
    const authorId = new Types.ObjectId().toString();
    mockStoryFind([]);
    const result = await getStoryByUserId({}, { author: authorId }, mockContext);
    expect(result).toEqual([]);
  });

  it('should validate author ID', async () => {
    await expectGraphQLError(() => getStoryByUserId({}, { author: '' }, mockContext), 'Author ID is required');
    await expectGraphQLError(() => getStoryByUserId({}, { author: '   ' }, mockContext), 'Author ID cannot be empty');
    await expectGraphQLError(() => getStoryByUserId({}, { author: 'invalid-id' }, mockContext), 'Invalid author ID format');
  });

  it('should re-throw GraphQLError as is', async () => {
    const authorId = new Types.ObjectId().toString();
    const graphqlError = new GraphQLError('Custom GraphQL Error');
    (Story.find as jest.Mock).mockImplementation(() => {
      throw graphqlError;
    });
    try {
      await getStoryByUserId({}, { author: authorId }, mockContext);
    } catch (error) {
      expect(error).toBe(graphqlError);
    }
  });

  it('should wrap Error instances', async () => {
    const authorId = new Types.ObjectId().toString();
    const dbError = new Error('Database connection failed');
    (Story.find as jest.Mock).mockImplementation(() => {
      throw dbError;
    });
    await expectGraphQLError(() => getStoryByUserId({}, { author: authorId }, mockContext), 'Failed to fetch stories by user ID: Database connection failed');
  });

  it('should handle unknown/string/null errors', async () => {
    const authorId = new Types.ObjectId().toString();
    await expectGraphQLError(() => {
      (Story.find as jest.Mock).mockImplementation(() => {
        throw { weird: 'error' };
      });
      return getStoryByUserId({}, { author: authorId }, mockContext);
    }, 'Failed to fetch stories by user ID: Unknown error');
    await expectGraphQLError(() => {
      (Story.find as jest.Mock).mockImplementation(() => {
        throw 'String error';
      });
      return getStoryByUserId({}, { author: authorId }, mockContext);
    }, 'Failed to fetch stories by user ID: Unknown error');
    await expectGraphQLError(() => {
      (Story.find as jest.Mock).mockImplementation(() => {
        throw null;
      });
      return getStoryByUserId({}, { author: authorId }, mockContext);
    }, 'Failed to fetch stories by user ID: Unknown error');
  });

  it('should handle populate and lean errors', async () => {
    const authorId = new Types.ObjectId().toString();
    const populateError = new Error('Populate failed');
    (Story.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockImplementation(() => {
        throw populateError;
      }),
    });
    await expectGraphQLError(() => getStoryByUserId({}, { author: authorId }, mockContext), 'Failed to fetch stories by user ID: Populate failed');

    const leanError = new Error('Lean failed');
    (Story.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({ lean: jest.fn().mockRejectedValue(leanError) }),
        }),
      }),
    });
    await expectGraphQLError(() => getStoryByUserId({}, { author: authorId }, mockContext), 'Failed to fetch stories by user ID: Lean failed');
  });
});
