import { removeFromSearchHistory } from 'src/resolvers/mutations'; 
import { User } from 'src/models';


jest.mock('src/models', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('removeFromSearchHistory', () => {
  const mockContext = { userId: 'currentUserId' };
  const searchedUserId = 'searchedUserId';

  const mockCurrentUser = {
    _id: 'currentUserId',
    searchHistory: ['searchedUserId', 'anotherUser'],
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if user is not authenticated', async () => {
    await expect(
      removeFromSearchHistory({}, { searchedUserId }, { userId: '' })
    ).rejects.toThrow('Authentication required');
  });

  it('throws an error if current user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      removeFromSearchHistory({}, { searchedUserId }, mockContext)
    ).rejects.toThrow('Current user not found');
  });

  it('removes user from search history successfully', async () => {
    const populatedUser = {
      _id: 'currentUserId',
      searchHistory: ['anotherUser']
    };

    // First call -> find currentUser
    (User.findById as jest.Mock)
      .mockResolvedValueOnce(mockCurrentUser)
      // Second call -> populate
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(populatedUser),
      });

    const result = await removeFromSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockCurrentUser.searchHistory).toEqual(['anotherUser']);
    expect(mockCurrentUser.save).toHaveBeenCalled();
    expect(result).toEqual(populatedUser);
  });

  it('does nothing if searched user not in history', async () => {
    const mockWithoutUser = {
      ...mockCurrentUser,
      searchHistory: ['anotherUser'],
    };

    (User.findById as jest.Mock)
      .mockResolvedValueOnce(mockWithoutUser)
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(mockWithoutUser),
      });

    const result = await removeFromSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockWithoutUser.searchHistory).toEqual(['anotherUser']);
    expect(mockWithoutUser.save).toHaveBeenCalled();
    expect(result).toEqual(mockWithoutUser);
  });
});
