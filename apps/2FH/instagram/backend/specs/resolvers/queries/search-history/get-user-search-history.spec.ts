import { getUserSearchHistory } from 'src/resolvers/queries'; 
import { User } from 'src/models';


jest.mock('src/models', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('getUserSearchHistory', () => {
  const mockContext = { userId: 'currentUserId' };

  const mockUser = {
    _id: 'currentUserId',
    searchHistory: [
      { _id: '1', fullName: 'User One', userName: 'user1', profileImage: 'img1', isVerified: true },
      { _id: '2', fullName: 'User Two', userName: 'user2', profileImage: 'img2', isVerified: false }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if not authenticated', async () => {
    await expect(
      getUserSearchHistory({}, { userId: 'currentUserId' }, { userId: '' })
    ).rejects.toThrow('Authentication required');
  });

  it('throws an error if accessing another user’s history', async () => {
    await expect(
      getUserSearchHistory({}, { userId: 'anotherUserId' }, mockContext)
    ).rejects.toThrow('Access denied');
  });

  it('throws an error if user not found', async () => {
    (User.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null)
    });

    await expect(
      getUserSearchHistory({}, { userId: 'currentUserId' }, mockContext)
    ).rejects.toThrow('User not found');
  });

  it('returns reversed search history if user found', async () => {
    (User.findById as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(mockUser)
    });

    const result = await getUserSearchHistory({}, { userId: 'currentUserId' }, mockContext);

    expect(result).toEqual([...mockUser.searchHistory].reverse());
  });
});
