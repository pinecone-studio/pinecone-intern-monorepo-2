import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearchLogic } from '@/utils/useSearchLogic';
import { 
  useSearchUsersQuery,
  useGetUserSearchHistoryQuery,
  useAddToSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useRemoveFromSearchHistoryMutation
} from '@/generated';
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/generated', () => ({
  useSearchUsersQuery: jest.fn(),
  useGetUserSearchHistoryQuery: jest.fn(),
  useAddToSearchHistoryMutation: jest.fn(),
  useClearSearchHistoryMutation: jest.fn(),
  useRemoveFromSearchHistoryMutation: jest.fn(),
}));
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchUsersQuery = useSearchUsersQuery as jest.MockedFunction<typeof useSearchUsersQuery>;
const mockUseGetUserSearchHistoryQuery = useGetUserSearchHistoryQuery as jest.MockedFunction<typeof useGetUserSearchHistoryQuery>;
const mockUseAddToSearchHistoryMutation = useAddToSearchHistoryMutation as jest.MockedFunction<typeof useAddToSearchHistoryMutation>;
const mockUseClearSearchHistoryMutation = useClearSearchHistoryMutation as jest.MockedFunction<typeof useClearSearchHistoryMutation>;
const mockUseRemoveFromSearchHistoryMutation = useRemoveFromSearchHistoryMutation as jest.MockedFunction<typeof useRemoveFromSearchHistoryMutation>;
const mockPush = jest.fn();
const mockRefetchSearchHistory = jest.fn();
const mockSearchHistory = [
  {
    _id: 'user-3',
    fullName: 'History User',
    userName: 'historyuser',
    profileImage: 'https://example.com/avatar3.jpg',
    isVerified: true
  }
];
describe('useSearchLogic - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockUseSearchUsersQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
      networkStatus: 7,
      called: false,
      client: {} as any,
      previousData: undefined,
      variables: { keyword: '' },
      fetchMore: jest.fn(),
      subscribeToMore: jest.fn(),
      updateQuery: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
    });
    mockUseGetUserSearchHistoryQuery.mockReturnValue({
      data: { getUserSearchHistory: mockSearchHistory },
      loading: false,
      error: undefined,
      refetch: mockRefetchSearchHistory,
      networkStatus: 7,
      called: true,
      client: {} as any,
      previousData: undefined,
      variables: { userId: 'current-user' },
      fetchMore: jest.fn(),
      subscribeToMore: jest.fn(),
      updateQuery: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
    });
    mockUseAddToSearchHistoryMutation.mockReturnValue([
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        client: {} as any,
        reset: jest.fn(),
      }
    ]);
    mockUseClearSearchHistoryMutation.mockReturnValue([
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        client: {} as any,
        reset: jest.fn(),
      }
    ]);
    mockUseRemoveFromSearchHistoryMutation.mockReturnValue([
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        client: {} as any,
        reset: jest.fn(),
      }
    ]);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSearchLogic('current-user', true));
    expect(result.current.searchQuery).toBe('');
    expect(result.current.shouldSearch).toBe(false);
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchHistory).toEqual(mockSearchHistory);
    expect(result.current.searchLoading).toBe(false);
  });
  it('should handle search query change', () => {
    const { result } = renderHook(() => useSearchLogic('current-user', true));
    act(() => {
      result.current.handleSearchChange({
        target: { value: 'test query' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.searchQuery).toBe('test query');
  });

});