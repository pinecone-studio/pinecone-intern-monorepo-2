/* eslint-disable max-lines */
import { GraphQLError } from 'graphql';
import { FollowRequest, FollowRequestStatus } from 'src/models/follow-request';
import { Story } from 'src/models/story';
import { getActiveStories } from 'src/resolvers/queries/story/get-active-stories';

// Mock the models
jest.mock('src/models/follow-request');
jest.mock('src/models/story');

const mockUserContext = {
  user: {
    id: 'user123',
    username: 'testuser',
  },
};

describe('getActiveStories', () => {
  // Cast mocks to jest.Mock for TypeScript
  const mockFollowRequestFind = FollowRequest.find as jest.Mock;
  const mockStoryFind = Story.find as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if user is not authenticated', async () => {
    await expect(getActiveStories({}, {}, {})).rejects.toThrow('User not authenticated');
  });

  it('should return active stories of accepted followed users', async () => {
    const mockFollowRequests = [{ receiverId: 'user456' }, { receiverId: 'user789' }];

    // Mock FollowRequest chain
    const mockSelect = jest.fn().mockResolvedValue(mockFollowRequests);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const mockStories = [
      {
        _id: 'story1',
        author: { _id: 'user456', userName: 'user1', profileImage: 'img1.jpg' },
        image: 'story1.jpg',
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 10000),
        viewers: [],
      },
    ];

    // Mock Story query chain
    const mockSort = jest.fn().mockResolvedValue(mockStories);
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    const result = await getActiveStories({}, {}, mockUserContext);

    // Verify FollowRequest.find was called correctly
    expect(mockFollowRequestFind).toHaveBeenCalledWith({
      requesterId: 'user123',
      status: FollowRequestStatus.ACCEPTED,
    });

    // Verify select was called
    expect(mockSelect).toHaveBeenCalledWith('receiverId');

    // Verify Story.find was called correctly
    expect(mockStoryFind).toHaveBeenCalledWith({
      author: { $in: ['user456', 'user789'] },
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: expect.any(Date) } }],
    });

    // Verify populate chains were called
    expect(mockPopulate1).toHaveBeenCalledWith('author', 'userName profileImage');
    expect(mockPopulate2).toHaveBeenCalledWith('viewers', 'userName profileImage');
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });

    expect(result).toEqual(mockStories);
  });

  it('should return empty array if no followed users', async () => {
    const mockSelect = jest.fn().mockResolvedValue([]);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const result = await getActiveStories({}, {}, mockUserContext);

    expect(mockFollowRequestFind).toHaveBeenCalledWith({
      requesterId: 'user123',
      status: FollowRequestStatus.ACCEPTED,
    });
    expect(mockSelect).toHaveBeenCalledWith('receiverId');
    expect(result).toEqual([]);
  });

  it('should throw error if FollowRequest.find fails', async () => {
    const mockSelect = jest.fn().mockRejectedValue(new Error('DB failure'));
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    await expect(getActiveStories({}, {}, mockUserContext)).rejects.toThrow('Failed to fetch active stories: DB failure');
  });

  it('should throw error if Story.find fails', async () => {
    // Mock successful FollowRequest call
    const mockFollowRequests = [{ receiverId: 'user456' }];
    const mockSelect = jest.fn().mockResolvedValue(mockFollowRequests);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    // Mock Story.find to throw error
    const mockPopulate1 = jest.fn().mockImplementation(() => {
      throw new Error('DB failure');
    });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    await expect(getActiveStories({}, {}, mockUserContext)).rejects.toThrow('Failed to fetch active stories: DB failure');
  });

  it('should handle stories with no expiration date', async () => {
    const mockFollowRequests = [{ receiverId: 'user456' }];
    const mockSelect = jest.fn().mockResolvedValue(mockFollowRequests);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const mockStories = [
      {
        _id: 'story1',
        author: { _id: 'user456', userName: 'user1', profileImage: 'img1.jpg' },
        image: 'story1.jpg',
        createdAt: new Date(),
        expiredAt: null, // No expiration
        viewers: [],
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockStories);
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    const result = await getActiveStories({}, {}, mockUserContext);

    expect(result).toEqual(mockStories);
  });

  it('should filter out expired stories', async () => {
    const mockFollowRequests = [{ receiverId: 'user456' }];
    const mockSelect = jest.fn().mockResolvedValue(mockFollowRequests);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const mockStories = [
      {
        _id: 'story1',
        author: { _id: 'user456', userName: 'user1', profileImage: 'img1.jpg' },
        image: 'story1.jpg',
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 10000), // Future date
        viewers: [],
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockStories);
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    // Call the function to trigger the mock calls
    await getActiveStories({}, {}, mockUserContext);

    // Now verify the query was called with correct filter
    expect(mockStoryFind).toHaveBeenCalledWith({
      author: { $in: ['user456'] },
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: expect.any(Date) } }],
    });
  });

  it('should sort stories by createdAt in descending order', async () => {
    const mockFollowRequests = [{ receiverId: 'user456' }];
    const mockSelect = jest.fn().mockResolvedValue(mockFollowRequests);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const mockStories = [
      {
        _id: 'story1',
        createdAt: new Date('2024-01-02'),
      },
      {
        _id: 'story2',
        createdAt: new Date('2024-01-01'),
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockStories);
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    const result = await getActiveStories({}, {}, mockUserContext);

    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockStories);
  });

  // Additional test to improve coverage
  it('should filter out null/undefined follow requests gracefully', async () => {
    // Mock FollowRequest to return mixed valid and invalid data
    const mockSelect = jest.fn().mockResolvedValue([
      null,
      undefined,
      { receiverId: 'user456' }, // Valid
      { receiverId: null }, // Invalid
      { receiverId: 'user789' }, // Valid
    ]);
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    const mockStories = [
      {
        _id: 'story1',
        author: { _id: 'user456', userName: 'user1', profileImage: 'img1.jpg' },
        image: 'story1.jpg',
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 10000),
        viewers: [],
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockStories);
    const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockStoryFind.mockReturnValue({ populate: mockPopulate1 });

    const result = await getActiveStories({}, {}, mockUserContext);

    expect(mockStoryFind).toHaveBeenCalledWith({
      author: { $in: ['user456', 'user789'] },
      $or: [{ expiredAt: { $exists: false } }, { expiredAt: null }, { expiredAt: { $gt: expect.any(Date) } }],
    });

    expect(result).toEqual(mockStories);
  });

  it('should throw GraphQLError with proper message format', async () => {
    const mockSelect = jest.fn().mockRejectedValue(new Error('Database connection failed'));
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    try {
      await getActiveStories({}, {}, mockUserContext);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch active stories: Database connection failed');
    }
  });

  it('should handle non-Error exceptions', async () => {
    const mockSelect = jest.fn().mockRejectedValue('String error');
    mockFollowRequestFind.mockReturnValue({
      select: mockSelect,
    });

    try {
      await getActiveStories({}, {}, mockUserContext);
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch active stories');
    }
  });
});
/* eslint-enable max-lines */
