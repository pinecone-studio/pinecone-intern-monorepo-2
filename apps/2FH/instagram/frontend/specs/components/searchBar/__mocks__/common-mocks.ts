export const mockUser = {
  _id: 'user-1',
  userName: 'testuser',
  fullName: 'Test User',
  email: 'test@example.com',
  profileImage: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  isVerified: true,
  followers: [],
  followings: [],
  posts: [],
  stories: []
};

export const mockSearchResults = [
  {
    _id: '1',
    userName: 'user1',
    fullName: 'User One',
    profileImage: 'https://example.com/avatar1.jpg',
    isVerified: true
  },
  {
    _id: '2',
    userName: 'user2',
    fullName: 'User Two',
    profileImage: null,
    isVerified: false
  }
];

export const mockSearchHistory = [
  {
    _id: '3',
    userName: 'user3',
    fullName: 'User Three',
    profileImage: 'https://example.com/avatar3.jpg',
    isVerified: true
  }
];

export const defaultMockSearchLogic = {
  searchQuery: '',
  searchResults: mockSearchResults,
  searchHistory: mockSearchHistory,
  searchLoading: false,
  handleSearchChange: jest.fn(),
  clearSearch: jest.fn(),
  handleUserClick: jest.fn(),
  handleClearAllRecent: jest.fn(),
  handleRemoveFromHistory: jest.fn()
};