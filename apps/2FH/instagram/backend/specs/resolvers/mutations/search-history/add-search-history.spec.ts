import { addToSearchHistory } from 'src/resolvers/mutations'; 
import { User } from 'src/models';

jest.mock('src/models', () => ({
  User: { findById: jest.fn() }
}));

describe('addToSearchHistory', () => {
  const mockContext = { userId: 'currentUserId' };
  const searchedUserId = 'searchedUserId';
  const mockCurrentUser = {
    _id: 'currentUserId',
    searchHistory: [] as string[],
    save: jest.fn().mockResolvedValue(true)
  };
  const mockSearchedUser = { _id: 'searchedUserId' };

  beforeEach(() => jest.clearAllMocks());

  const setupMock = (searchedUser: any, currentUser: any, populatedUser: any) => {
    const mockPopulate = jest.fn().mockResolvedValue(populatedUser);
    let callCount = 0;
    (User.findById as jest.Mock).mockImplementation((id: string) => {
      callCount++;
      if (id === searchedUserId) return Promise.resolve(searchedUser);
      if (id === mockContext.userId) {
        return callCount <= 2 ? Promise.resolve(currentUser) : { populate: mockPopulate };
      }
    });
    return mockPopulate;
  };

  it('throws an error if user is not authenticated', async () => {
    await expect(addToSearchHistory({}, { searchedUserId }, { userId: '' }))
      .rejects.toThrow('Authentication required');
  });

  it('throws an error if user tries to add themselves', async () => {
    await expect(addToSearchHistory({}, { searchedUserId: mockContext.userId }, mockContext))
      .rejects.toThrow('Cannot add yourself to search history');
  });

  it('throws an error if searched user not found', async () => {
    (User.findById as jest.Mock).mockImplementation((id: string) => 
      id === searchedUserId ? Promise.resolve(null) : Promise.resolve(mockCurrentUser)
    );
    await expect(addToSearchHistory({}, { searchedUserId }, mockContext))
      .rejects.toThrow('Searched user not found');
  });

  it('throws an error if current user not found', async () => {
    (User.findById as jest.Mock).mockImplementation((id: string) => 
      id === mockContext.userId ? Promise.resolve(null) : Promise.resolve(mockSearchedUser)
    );
    await expect(addToSearchHistory({}, { searchedUserId }, mockContext))
      .rejects.toThrow('Current user not found');
  });

  it('adds new user to search history and returns populated user', async () => {
    const populatedUser = { _id: 'currentUserId', searchHistory: [mockSearchedUser] };
    setupMock(mockSearchedUser, mockCurrentUser, populatedUser);
    
    const result = await addToSearchHistory({}, { searchedUserId }, mockContext);
    
    expect(mockCurrentUser.searchHistory[0]).toBe(searchedUserId);
    expect(mockCurrentUser.save).toHaveBeenCalled();
    expect(result).toEqual(populatedUser);
  });

  it('removes existing user from search history and adds to front', async () => {
    const mockCurrentUserWithHistory = {
      ...mockCurrentUser,
      searchHistory: ['existingUser', searchedUserId, 'otherUserId'] as string[]
    };
    const populatedUser = { _id: 'currentUserId', searchHistory: [mockSearchedUser] };
    setupMock(mockSearchedUser, mockCurrentUserWithHistory, populatedUser);

    await addToSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockCurrentUserWithHistory.searchHistory[0]).toBe(searchedUserId);
    expect(mockCurrentUserWithHistory.searchHistory.filter(id => id === searchedUserId).length).toBe(1);
    expect(mockCurrentUserWithHistory.searchHistory.length).toBe(3);
  });

  it('keeps search history length <= 50 when adding new user', async () => {
    const mockCurrentUserWith50Items = {
      ...mockCurrentUser,
      searchHistory: Array.from({ length: 50 }, (_, i) => `user${i}`) as string[]
    };
    const populatedUser = { _id: 'currentUserId', searchHistory: [mockSearchedUser] };
    setupMock(mockSearchedUser, mockCurrentUserWith50Items, populatedUser);

    await addToSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockCurrentUserWith50Items.searchHistory.length).toBe(50);
    expect(mockCurrentUserWith50Items.searchHistory[0]).toBe(searchedUserId);
  });

  it('keeps search history length <= 50 when moving existing user to front', async () => {
    const searchHistoryWith50Items = Array.from({ length: 50 }, (_, i) => 
      i === 25 ? searchedUserId : `user${i}`
    );
    const mockCurrentUserWith50Items = {
      ...mockCurrentUser,
      searchHistory: searchHistoryWith50Items as string[]
    };
    const populatedUser = { _id: 'currentUserId', searchHistory: [mockSearchedUser] };
    setupMock(mockSearchedUser, mockCurrentUserWith50Items, populatedUser);

    await addToSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockCurrentUserWith50Items.searchHistory.length).toBe(50);
    expect(mockCurrentUserWith50Items.searchHistory[0]).toBe(searchedUserId);
    expect(mockCurrentUserWith50Items.searchHistory.filter(id => id === searchedUserId).length).toBe(1);
  });

  it('handles case when search history is exactly 50 items and user is not in history', async () => {
    // Create a user with exactly 50 items, none being the searched user
    const mockCurrentUserWith50Items = {
      ...mockCurrentUser,
      searchHistory: Array.from({ length: 50 }, (_, i) => `user${i}`) as string[]
    };

    const populatedUser = {
      _id: 'currentUserId',
      searchHistory: [mockSearchedUser],
    };

    const mockPopulate = jest.fn().mockResolvedValue(populatedUser);
    
    let callCount = 0;
    (User.findById as jest.Mock).mockImplementation((id: string) => {
      callCount++;
      if (id === searchedUserId) {
        return Promise.resolve(mockSearchedUser);
      } else if (id === mockContext.userId) {
        if (callCount <= 2) {
          // First two calls (in Promise.all)
          return Promise.resolve(mockCurrentUserWith50Items);
        } else {
  
          return {
            populate: mockPopulate
          };
        }
      }
    });

    await addToSearchHistory({}, { searchedUserId }, mockContext);

    expect(mockCurrentUserWith50Items.searchHistory.length).toBe(50);
    expect(mockCurrentUserWith50Items.searchHistory[0]).toBe(searchedUserId);
    expect(mockCurrentUserWith50Items.searchHistory[49]).toBe('user48');
  });
});
