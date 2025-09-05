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

describe('SearchSidebar - Basic Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({ isSearchOpen: true });
    mockUseAuth.mockReturnValue({ user: mockUser, isLoading: false });
    mockUseSearchLogic.mockReturnValue(defaultMockSearchLogic);
  });

  it('renders nothing when search is not open', () => {
    mockUseNavigation.mockReturnValue({ isSearchOpen: false });

    const { container } = render(<SearchSidebar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });

    render(<SearchSidebar />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders login message when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });

    render(<SearchSidebar />);
    expect(screen.getByText('Please log in to use search')).toBeInTheDocument();
  });

  it('renders search sidebar when authenticated and search is open', () => {
    render(<SearchSidebar />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders search input with correct props', () => {
    render(<SearchSidebar />);
    
    const searchInput = screen.getByTestId('search-input-field');
    expect(searchInput).toHaveValue('');
    expect(searchInput).toHaveAttribute('placeholder', 'Search');
  });

  it('calls handleSearchChange when search input changes', () => {
    const mockHandleSearchChange = jest.fn();
    
    mockUseSearchLogic.mockReturnValue({
      ...defaultMockSearchLogic,
      handleSearchChange: mockHandleSearchChange
    });

    render(<SearchSidebar />);

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'new query' } });

    expect(mockHandleSearchChange).toHaveBeenCalledTimes(1);
    expect(mockHandleSearchChange).toHaveBeenCalledWith(expect.any(Object));
  });
});