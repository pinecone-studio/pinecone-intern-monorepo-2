import { getNotFollowingUsers } from 'src/resolvers/queries'; 
import { User } from 'src/models/user';

jest.mock('src/models/user', () => ({
  User: {
    findById: jest.fn(),
    find: jest.fn()
  }
}));

describe('getNotFollowingUsers', () => {
  const mockUser = User as jest.Mocked<typeof User>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return users that the current user is not following', async () => {
    const userId = 'user123';
    const followingUser1 = { _id: 'following1' };
    const followingUser2 = { _id: 'following2' };
    const currentUserMock = {
      _id: userId,
      followings: [followingUser1, followingUser2]
    };
    
    const notFollowingUser1 = { _id: 'notFollowing1', name: 'User 1' };
    const notFollowingUser2 = { _id: 'notFollowing2', name: 'User 2' };
    const populateMock = jest.fn().mockResolvedValue(currentUserMock);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);
    mockUser.find.mockResolvedValue([notFollowingUser1, notFollowingUser2]);

    const result = await getNotFollowingUsers(null, { userId });

    expect(mockUser.findById).toHaveBeenCalledWith(userId);
    expect(populateMock).toHaveBeenCalledWith('followings');
    expect(mockUser.find).toHaveBeenCalledWith({
      _id: { $nin: ['following1', 'following2', userId] }
    });
    expect(result).toEqual([notFollowingUser1, notFollowingUser2]);
  });

  it('should throw an error when user is not found', async () => {
    const userId = 'nonExistentUser';
    const populateMock = jest.fn().mockResolvedValue(null);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);

    await expect(getNotFollowingUsers(null, { userId }))
      .rejects
      .toThrow('User not found');
    
    expect(mockUser.findById).toHaveBeenCalledWith(userId);
    expect(populateMock).toHaveBeenCalledWith('followings');
    expect(mockUser.find).not.toHaveBeenCalled();
  });

  it('should handle user with empty followings array', async () => {
    const userId = 'user456';
    const currentUserMock = {
      _id: userId,
      followings: []
    };
    
    const allOtherUsers = [
      { _id: 'user1', name: 'User 1' },
      { _id: 'user2', name: 'User 2' }
    ];
    
    const populateMock = jest.fn().mockResolvedValue(currentUserMock);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);
    mockUser.find.mockResolvedValue(allOtherUsers);

    const result = await getNotFollowingUsers(null, { userId });

    expect(mockUser.find).toHaveBeenCalledWith({
      _id: { $nin: [userId] }
    });
    expect(result).toEqual(allOtherUsers);
  });

  it('should handle user with one following', async () => {
    const userId = 'user789';
    const followingUser = { _id: 'following1' };
    const currentUserMock = {
      _id: userId,
      followings: [followingUser]
    };
    
    const notFollowingUsers = [
      { _id: 'user1', name: 'User 1' },
      { _id: 'user2', name: 'User 2' }
    ];
    
    const populateMock = jest.fn().mockResolvedValue(currentUserMock);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);
    mockUser.find.mockResolvedValue(notFollowingUsers);

    const result = await getNotFollowingUsers(null, { userId });
    expect(mockUser.find).toHaveBeenCalledWith({
      _id: { $nin: ['following1', userId] }
    });
    expect(result).toEqual(notFollowingUsers);
  });

  it('should return empty array when no users are found', async () => {
    const userId = 'user999';
    const currentUserMock = {
      _id: userId,
      followings: [{ _id: 'following1' }]
    };
    
    const populateMock = jest.fn().mockResolvedValue(currentUserMock);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);
    mockUser.find.mockResolvedValue([]);

    const result = await getNotFollowingUsers(null, { userId });
    expect(result).toEqual([]);
  });

  it('should ignore the first parameter (parent/root)', async () => {
    const userId = 'user123';
    const currentUserMock = {
      _id: userId,
      followings: []
    };
    
    const populateMock = jest.fn().mockResolvedValue(currentUserMock);
    mockUser.findById.mockReturnValue({ populate: populateMock } as any);
    mockUser.find.mockResolvedValue([]);

    const mockParent = { someData: 'test' };
    const result = await getNotFollowingUsers(mockParent, { userId });

    expect(mockUser.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
  });
});