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
const mockSearchHistory = [
  {
    _id: 'user-3',
    fullName: 'History User',
    userName: 'historyuser',
    profileImage: 'https://example.com/avatar3.jpg',
    isVerified: true
  }
];
describe('useSearchLogic - Query Error Callbacks', () => {
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
  it('should call onError callback for useSearchUsersQuery', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    let capturedOnError: any;
    mockUseSearchUsersQuery.mockImplementation((options) => {
      capturedOnError = options?.onError;
      return {
        data: undefined,
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
      };
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
    renderHook(() => useSearchLogic('current-user', true));
    if (capturedOnError) {
      capturedOnError(new Error('Search query failed'));
    }
    expect(consoleSpy).toHaveBeenCalledWith('Search error:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});