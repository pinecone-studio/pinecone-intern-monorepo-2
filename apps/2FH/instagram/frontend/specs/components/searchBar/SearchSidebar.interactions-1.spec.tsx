import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SearchSidebar } from '@/components/searchBar/SearchSidebar';
import { mockUser, defaultMockSearchLogic } from './__mocks__/common-mocks';

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

describe('SearchSidebar - Interactions Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({ isSearchOpen: true });
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockUseSearchLogic.mockReturnValue(defaultMockSearchLogic);
  });

  it('calls clearSearch when clear button is clicked', () => {
    const mockClearSearch = jest.fn();
    
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      clearSearch: mockClearSearch
    });

    render(<SearchSidebar />);

    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);

    expect(mockClearSearch).toHaveBeenCalledTimes(1);
  });

  it('renders search history when no search query', () => {
    render(<SearchSidebar />);
    
    expect(screen.getByTestId('search-history')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('renders search results when there is a search query', () => {
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      searchQuery: 'test query'
    });

    render(<SearchSidebar />);

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });
});