import { renderHook } from '@testing-library/react';
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
const mockAddToSearchHistory = jest.fn();
const mockClearSearchHistory = jest.fn();
const mockRemoveFromSearchHistory = jest.fn();
const mockSearchResults = [
  {
    _id: 'user-2',
    fullName: 'Search Result User',
    userName: 'searchuser',
    profileImage: 'https://example.com/avatar2.jpg',
    isVerified: false
  }
];
describe('useSearchLogic - Query Error Callbacks Part 2', () => {
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
    mockUseAddToSearchHistoryMutation.mockReturnValue([
      mockAddToSearchHistory,
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
      mockClearSearchHistory,
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
      mockRemoveFromSearchHistory,
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
  it('should call onError callback for useGetUserSearchHistoryQuery', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    let capturedOnError: any;
    mockUseGetUserSearchHistoryQuery.mockImplementation((options) => {
      capturedOnError = options?.onError;
      return {
        data: undefined,
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
      };
    });
    mockUseSearchUsersQuery.mockReturnValue({
      data: { searchUsers: mockSearchResults },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
      networkStatus: 7,
      called: true,
      client: {} as any,
      previousData: undefined,
      variables: { keyword: 'test' },
      fetchMore: jest.fn(),
      subscribeToMore: jest.fn(),
      updateQuery: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
    });
    renderHook(() => useSearchLogic('current-user', true));
    if (capturedOnError) {
      capturedOnError(new Error('Get search history failed'));
    }
    expect(consoleSpy).toHaveBeenCalledWith('Get search history error:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});