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
  NavigationProvider: ({ children }: { children: any }) => 
    jest.requireActual('react').createElement('div', { 'data-testid': 'navigation-provider' }, children)
}));

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
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