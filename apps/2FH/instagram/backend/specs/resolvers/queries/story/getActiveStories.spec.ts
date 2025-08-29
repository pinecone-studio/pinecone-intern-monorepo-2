/* eslint-disable max-lines */
import { GraphQLError } from 'graphql';
import { Story } from 'src/models/story';
import { getActiveStories } from 'src/resolvers/queries/story/get-active-stories';

jest.mock('src/models/story');
describe('getActiveStories', () => {
  const mockStoryFind = Story.find as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should return all stories with author and viewers populated', async () => {
    const mockStories = [
      {
        _id: 'story1',
        author: { _id: 'user456', userName: 'user1', profileImage: 'img1.jpg', email: 'user1@test.com', isVerified: true },
        image: 'story1.jpg',
        createdAt: new Date('2024-01-02'),
        expiredAt: new Date(Date.now() + 10000),
        viewers: [{ _id: 'viewer1', userName: 'viewer1', profileImage: 'viewer1.jpg' }],
      },
      {
        _id: 'story2',
        author: { _id: 'user789', userName: 'user2', profileImage: 'img2.jpg', email: 'user2@test.com', isVerified: false },
        image: 'story2.jpg',
        createdAt: new Date('2024-01-01'),
        expiredAt: new Date(Date.now() + 5000),
        viewers: [],
      },
    ];
    const mockLean = jest.fn().mockResolvedValue(mockStories);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    const result = await getActiveStories();

    expect(mockStoryFind).toHaveBeenCalledWith();
    expect(mockPopulate1).toHaveBeenCalledWith('author', 'userName profileImage email isVerified');
    expect(mockPopulate2).toHaveBeenCalledWith('viewers', 'userName profileImage');
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockLean).toHaveBeenCalled();
    expect(result).toEqual(mockStories);
  });
  it('should return empty array if no stories exist', async () => {
    const mockLean = jest.fn().mockResolvedValue([]);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });
    const result = await getActiveStories();
    expect(result).toEqual([]);
  });

  it('should re-throw existing GraphQLError without modification', async () => {
    const existingGraphQLError = new GraphQLError('Existing GraphQL error');
    mockStoryFind.mockImplementation(() => {
      throw existingGraphQLError;
    });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBe(existingGraphQLError);
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Existing GraphQL error');
    }
  });

  it('should wrap Error instances in GraphQLError with message', async () => {
    const regularError = new Error('Database connection failed');
    mockStoryFind.mockImplementation(() => {
      throw regularError;
    });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:Database connection failed');
    }
  });
  it('should handle string errors with unknown error message', async () => {
    mockStoryFind.mockImplementation(() => {
      throw 'String error';
    });

    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:unknown error');
    }
  });
  it('should handle null errors with unknown error message', async () => {
    mockStoryFind.mockImplementation(() => {
      throw null;
    });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:unknown error');
    }
  });
  it('should handle undefined errors with unknown error message', async () => {
    mockStoryFind.mockImplementation(() => {
      throw undefined;
    });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:unknown error');
    }
  });
  it('should handle number errors with unknown error message', async () => {
    mockStoryFind.mockImplementation(() => {
      throw 404;
    });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:unknown error');
    }
  });

  it('should handle error in populate chain', async () => {
    const dbError = new Error('Population failed');
    const mockPopulate1 = jest.fn().mockImplementation(() => {
      throw dbError;
    });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:Population failed');
    }
  });
  it('should handle async error in lean call', async () => {
    const dbError = new Error('Lean operation failed');
    const mockLean = jest.fn().mockRejectedValue(dbError);
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });
    try {
      await getActiveStories();
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch all stories:Lean operation failed');
    }
  });
});
