import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SearchSidebar } from '@/components/searchBar/SearchSidebar';
import { mockUser, mockSearchResults, mockSearchHistory, defaultMockSearchLogic } from './__mocks__/common-mocks';

// Mock the hooks
jest.mock('@/components/NavigationProvider/NavigationProvider', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/utils/useSearchLogic', () => ({
  useSearchLogic: jest.fn(),
}));

// Mock the search bar components
jest.mock('@/components/searchBar/SearchInput', () => ({
  SearchInput: ({ searchQuery, onSearchChange, onClear }: any) => 
    jest.requireActual('react').createElement('div', { 'data-testid': 'search-input' },
      jest.requireActual('react').createElement('input', {
        'data-testid': 'search-input-field',
        value: searchQuery,
        onChange: onSearchChange,
        placeholder: 'Search'
      }),
      jest.requireActual('react').createElement('button', { 'data-testid': 'clear-button', onClick: onClear }, 'Clear')
    )
}));

jest.mock('@/components/searchBar/SearchResults', () => ({
  SearchResults: ({ results, loading, onUserClick }: any) => 
    jest.requireActual('react').createElement('div', { 'data-testid': 'search-results' },
      loading ? 
        jest.requireActual('react').createElement('div', null, 'Searching...') :
        results.map((user: any) => 
          jest.requireActual('react').createElement('div', {
            key: user._id,
            'data-testid': `search-result-${user._id}`,
            onClick: () => onUserClick(user)
          }, user.userName)
        )
    )
}));

jest.mock('@/components/searchBar/SearchedHistory', () => ({
  SearchHistory: ({ searchHistory, onUserClick, onRemoveUser }: any) => 
    jest.requireActual('react').createElement('div', { 'data-testid': 'search-history' },
      searchHistory.map((user: any) => 
        jest.requireActual('react').createElement('div', {
          key: user._id,
          'data-testid': `history-item-${user._id}`,
          onClick: () => onUserClick(user)
        },
          user.userName,
          jest.requireActual('react').createElement('button', {
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

import { useNavigation } from '@/components/NavigationProvider/NavigationProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchLogic } from '@/utils/useSearchLogic';

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSearchLogic = useSearchLogic as jest.MockedFunction<typeof useSearchLogic>;

describe('SearchSidebar - Interactions Part 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({ isSearchOpen: true });
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockUseSearchLogic.mockReturnValue(defaultMockSearchLogic);
  });

  it('calls handleUserClick when search result is clicked', () => {
    const mockHandleUserClick = jest.fn();
    
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      searchQuery: 'test query',
      handleUserClick: mockHandleUserClick
    });

    render(<SearchSidebar />);

    const searchResult = screen.getByTestId('search-result-1');
    fireEvent.click(searchResult);

    expect(mockHandleUserClick).toHaveBeenCalledWith(mockSearchResults[0]);
  });

  it('calls handleUserClick when history item is clicked', () => {
    const mockHandleUserClick = jest.fn();
    
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      handleUserClick: mockHandleUserClick
    });

    render(<SearchSidebar />);

    const historyItem = screen.getByTestId('history-item-3');
    fireEvent.click(historyItem);

    expect(mockHandleUserClick).toHaveBeenCalledWith(mockSearchHistory[0]);
  });

  it('calls handleClearAllRecent when clear all button is clicked', () => {
    const mockHandleClearAllRecent = jest.fn();
    
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      handleClearAllRecent: mockHandleClearAllRecent
    });

    render(<SearchSidebar />);

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(mockHandleClearAllRecent).toHaveBeenCalledTimes(1);
  });
});