import React from 'react';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/test',
}));

// Mock the useSearchLogic hook
jest.mock('@/utils/useSearchLogic', () => ({
  useSearchLogic: jest.fn()
}));

// Mock the NavigationProvider
jest.mock('@/components/NavigationProvider/NavigationProvider', () => ({
  useNavigation: jest.fn(),
  NavigationProvider: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'navigation-provider' }, children)
}));

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the search bar components
jest.mock('@/components/searchBar/SearchInput', () => ({
  SearchInput: ({ searchQuery, onSearchChange, onClear }: any) => 
    React.createElement('div', { 'data-testid': 'search-input' },
      React.createElement('input', {
        'data-testid': 'search-input-field',
        value: searchQuery,
        onChange: onSearchChange,
        placeholder: 'Search'
      }),
      React.createElement('button', { 'data-testid': 'clear-button', onClick: onClear }, 'Clear')
    )
}));

jest.mock('@/components/searchBar/SearchResults', () => ({
  SearchResults: ({ results, loading, onUserClick }: any) => 
    React.createElement('div', { 'data-testid': 'search-results' },
      loading ? 
        React.createElement('div', null, 'Searching...') :
        results.map((user: any) => 
          React.createElement('div', {
            key: user._id,
            'data-testid': `search-result-${user._id}`,
            onClick: () => onUserClick(user)
          }, user.userName)
        )
    )
}));

jest.mock('@/components/searchBar/SearchedHistory', () => ({
  SearchHistory: ({ searchHistory, onUserClick, onRemoveUser }: any) => 
    React.createElement('div', { 'data-testid': 'search-history' },
      searchHistory.map((user: any) => 
        React.createElement('div', {
          key: user._id,
          'data-testid': `history-item-${user._id}`,
          onClick: () => onUserClick(user)
        },
          user.userName,
          React.createElement('button', {
            'data-testid': `remove-${user._id}`,
            onClick: (e: any) => {
              e.stopPropagation();
              onRemoveUser?.(user._id);
            }
          }, 'Remove')
        )
      )
    )
}));

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