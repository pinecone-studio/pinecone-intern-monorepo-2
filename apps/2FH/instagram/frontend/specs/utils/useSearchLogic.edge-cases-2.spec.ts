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
const mockAddToSearchHistory = jest.fn();
const mockClearSearchHistory = jest.fn();
const mockRemoveFromSearchHistory = jest.fn();
const mockUser = {
  _id: 'user-1',
  fullName: 'Test User',
  userName: 'testuser',
  profileImage: 'https://example.com/avatar.jpg',
  isVerified: true
};
describe('useSearchLogic - Edge Cases Part 2', () => {
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
  it('should handle error in addToSearchHistory', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAddToSearchHistory.mockRejectedValue(new Error('Add to history failed'));
    mockUseSearchUsersQuery.mockReturnValue({
      data: { searchUsers: [] },
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
    mockUseGetUserSearchHistoryQuery.mockReturnValue({
      data: { getUserSearchHistory: [] },
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
    const { result } = renderHook(() => useSearchLogic('current-user', true));
    await act(async () => {
      await result.current.handleUserClick(mockUser);
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error adding to search history:', expect.any(Error));
    expect(mockPush).toHaveBeenCalledWith(`/${mockUser.userName}`);
    consoleSpy.mockRestore();
  });
});