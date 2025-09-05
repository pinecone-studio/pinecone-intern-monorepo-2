import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearchLogic } from '@/utils/useSearchLogic';
import { useSearchUsersQuery, useGetUserSearchHistoryQuery, useAddToSearchHistoryMutation,useClearSearchHistoryMutation,useRemoveFromSearchHistoryMutation} from '@/generated';
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
const mockSearchResults = [
  {
    _id: 'user-2',
    fullName: 'Search Result User',
    userName: 'searchuser',
    profileImage: 'https://example.com/avatar2.jpg',
    isVerified: false
  }
];
const mockSearchHistory = [
  {
    _id: 'user-3',
    fullName: 'History User',
    userName: 'historyuser',
    profileImage: 'https://example.com/avatar3.jpg',
    isVerified: true
  }
];
describe('useSearchLogic - Interactions', () => {
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
  it('should handle user click and add to search history', async () => {
    const { result } = renderHook(() => useSearchLogic('current-user', true));
    await act(async () => {
      await result.current.handleUserClick(mockUser);
    });
    expect(mockAddToSearchHistory).toHaveBeenCalledWith({
      variables: { searchedUserId: mockUser._id }
    });
    expect(mockPush).toHaveBeenCalledWith(`/${mockUser.userName}`);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.shouldSearch).toBe(false);
  });
  it('should handle user click without adding to history for current user', async () => {
    const { result } = renderHook(() => useSearchLogic('user-1', true));
    await act(async () => {
      await result.current.handleUserClick(mockUser);
    });
    expect(mockAddToSearchHistory).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(`/${mockUser.userName}`);
  });
  it('should handle clear all recent', () => {
    const { result } = renderHook(() => useSearchLogic('current-user', true));
    act(() => {
      result.current.handleClearAllRecent();
    });
    expect(mockClearSearchHistory).toHaveBeenCalled();
  });
});