import { getUserByUsername } from 'src/resolvers/queries/user/get-user-by-username';
import { User } from 'src/models/user';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

jest.mock('src/models/user');

const _ = undefined;

const mockUser = {
  _id: new Types.ObjectId('68ac3227d43f6914d3fbff57'),
  fullName: 'Test User',
  userName: 'testuser',
  email: 'test@example.com',
  followers: [],
  followings: [],
  stories: [],
  posts: [],
};

describe('getUserByUsername', () => {
  const mockUserFindOne = User.findOne as jest.Mock;

  const setupMockPopulateChain = (finalResult: any) => {
    const mockPopulate4 = jest.fn().mockResolvedValue(finalResult);
    const mockPopulate3 = jest.fn().mockReturnValue({ populate: mockPopulate4 });
    const mockPopulate2 = jest.fn().mockReturnValue({ populate: mockPopulate3 });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockUserFindOne.mockReturnValue({ populate: mockPopulate1 });
    return { mockPopulate1, mockPopulate2, mockPopulate3, mockPopulate4 };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if username is not provided', async () => {
    await expect(getUserByUsername(_, { userName: '' })).rejects.toThrow(new GraphQLError('Username is required'));
  });

  it('should throw error if username is null or undefined', async () => {
    await expect(getUserByUsername(_, { userName: null as any })).rejects.toThrow(new GraphQLError('Username is required'));
    await expect(getUserByUsername(_, { userName: undefined as any })).rejects.toThrow(new GraphQLError('Username is required'));
  });

  it('should throw error if user is not found', async () => {
    setupMockPopulateChain(null);

    await expect(getUserByUsername(_, { userName: 'nonexistentuser' })).rejects.toThrow(new GraphQLError('User not found'));

    expect(mockUserFindOne).toHaveBeenCalledWith({ userName: 'nonexistentuser' });
  });

  it('should return user if found', async () => {
    const { mockPopulate1, mockPopulate2, mockPopulate3, mockPopulate4 } = setupMockPopulateChain(mockUser);

    const result = await getUserByUsername(_, { userName: 'testuser' });

    expect(result).toEqual(mockUser);
    expect(mockUserFindOne).toHaveBeenCalledWith({ userName: 'testuser' });
    expect(mockPopulate1).toHaveBeenCalledWith('followers', 'userName fullName profileImage isVerified');
    expect(mockPopulate2).toHaveBeenCalledWith('followings', 'userName fullName profileImage isVerified');
    expect(mockPopulate3).toHaveBeenCalledWith('stories');
    expect(mockPopulate4).toHaveBeenCalledWith('posts');
  });

  it('should handle database errors', async () => {
    const mockPopulate4 = jest.fn().mockRejectedValue(new Error('Database connection failed'));
    const mockPopulate3 = jest.fn().mockReturnValue({ populate: mockPopulate4 });
    const mockPopulate2 = jest.fn().mockReturnValue({ populate: mockPopulate3 });
    const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
    mockUserFindOne.mockReturnValue({ populate: mockPopulate1 });

    await expect(getUserByUsername(_, { userName: 'testuser' })).rejects.toThrow(new Error('Database connection failed'));
  });

  it('should handle usernames with special characters', async () => {
    const specialUsernames = ['user.name', 'user_name', 'user-name', 'user123'];

    for (const username of specialUsernames) {
      setupMockPopulateChain(mockUser);
      const result = await getUserByUsername(_, { userName: username });
      expect(result).toEqual(mockUser);
      expect(mockUserFindOne).toHaveBeenCalledWith({ userName: username });
      jest.clearAllMocks();
    }
  });

  it('should handle case sensitive username search', async () => {
    setupMockPopulateChain(null);

    await expect(getUserByUsername(_, { userName: 'TestUser' })).rejects.toThrow(new GraphQLError('User not found'));
    expect(mockUserFindOne).toHaveBeenCalledWith({ userName: 'TestUser' });
  });

  it('should handle whitespace-only usernames as valid but non-existent', async () => {
    const whitespaceUsernames = ['   ', '\t', '\n', ' \t \n '];

    for (const username of whitespaceUsernames) {
      setupMockPopulateChain(null);
      await expect(getUserByUsername(_, { userName: username })).rejects.toThrow(new GraphQLError('User not found'));
      jest.clearAllMocks();
    }
  });

  it('should properly populate all related fields', async () => {
    const userWithPopulatedFields = {
      ...mockUser,
      followers: [{ userName: 'follower1', fullName: 'Follower One', profileImage: 'image1.jpg', isVerified: false }],
      followings: [{ userName: 'following1', fullName: 'Following One', profileImage: 'image2.jpg', isVerified: true }],
      stories: [{ _id: new Types.ObjectId(), content: 'Story content' }],
      posts: [{ _id: new Types.ObjectId(), caption: 'Post caption' }],
    };

    setupMockPopulateChain(userWithPopulatedFields);

    const result = await getUserByUsername(_, { userName: 'testuser' });

    expect(result).toEqual(userWithPopulatedFields);
    expect(result.followers).toHaveLength(1);
    expect(result.followings).toHaveLength(1);
    expect(result.stories).toHaveLength(1);
    expect(result.posts).toHaveLength(1);
  });
});
