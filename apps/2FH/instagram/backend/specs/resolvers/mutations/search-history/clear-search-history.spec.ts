import { clearSearchHistory } from 'src/resolvers/mutations'; 
import { User } from 'src/models';

jest.mock('src/models', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('clearSearchHistory', () => {
  const mockContext = { userId: 'currentUserId' };

  const mockCurrentUser = {
    _id: 'currentUserId',
    searchHistory: ['user1', 'user2'],
    save: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(
      clearSearchHistory({}, {}, { userId: '' })
    ).rejects.toThrow('Authentication required');
  });

  it('throws an error if current user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      clearSearchHistory({}, {}, mockContext)
    ).rejects.toThrow('Current user not found');
  });

  it('clears search history successfully', async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockCurrentUser);

    const result = await clearSearchHistory({}, {}, mockContext);

    expect(mockCurrentUser.searchHistory).toEqual([]);
    expect(mockCurrentUser.save).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Search history cleared successfully'
    });
  });
});
