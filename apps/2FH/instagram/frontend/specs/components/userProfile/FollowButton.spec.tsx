import '@testing-library/jest-dom';
import { FollowButton } from '@/components/userProfile/FollowButton';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
const mockFollowUser = jest.fn();
const mockUnfollowUser = jest.fn();
const mockRefetch = jest.fn();
let mockUseFollowUserMutation: jest.Mock;
let mockUseUnfollowUserMutation: jest.Mock;
let mockUseGetUserByUsernameQuery: jest.Mock;
jest.mock('@/generated', () => ({
  get useFollowUserMutation() {
    return mockUseFollowUserMutation;
  },
  get useUnfollowUserMutation() {
    return mockUseUnfollowUserMutation;
  },
  get useGetUserByUsernameQuery() {
    return mockUseGetUserByUsernameQuery;
  },
}));
describe('FollowButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFollowUserMutation = jest.fn().mockReturnValue([mockFollowUser, { loading: false }]);
    mockUseUnfollowUserMutation = jest.fn().mockReturnValue([mockUnfollowUser, { loading: false }]);
    mockUseGetUserByUsernameQuery = jest.fn().mockReturnValue({ refetch: mockRefetch });
  });
  it('renders "Follow" button by default', () => {
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Follow');
  });
  it('calls followUser and updates to "Following"', async () => {
    mockFollowUser.mockResolvedValueOnce({
      data: { followUser: { success: true } },
    });
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(mockFollowUser).toHaveBeenCalledWith({ variables: { targetUserId: '1' } });
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Following');
    });
  });
  it('calls unfollowUser and updates back to "Follow"', async () => {
    mockUnfollowUser.mockResolvedValueOnce({
      data: { unfollowUser: { success: true } },
    });
    render(<FollowButton targetUserId="1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Following');
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(mockUnfollowUser).toHaveBeenCalledWith({ variables: { targetUserId: '1' } });
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Follow');
    });
  });
  it('renders "Requested" when followUser returns PENDING', async () => {
    mockFollowUser.mockResolvedValueOnce({
      data: { followUser: { request: { status: 'PENDING' } } },
    });
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={true} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Requested');
    });
  });
  it('handles follow error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation for console.error
    });
    mockFollowUser.mockRejectedValueOnce(new Error('Network error'));
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Follow error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
  it('handles unfollow error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation for console.error
    });
    mockUnfollowUser.mockRejectedValueOnce(new Error('Network error'));
    render(<FollowButton targetUserId="1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Unfollow error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
  it('renders "Follow Request" for private accounts', () => {
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={true} userName="testUser" />);
    expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Follow Request');
  });
  it('shows loading state when followUser is loading', () => {
    mockUseFollowUserMutation = jest.fn().mockReturnValue([mockFollowUser, { loading: true }]);
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Following...');
  });
  it('shows loading state when unfollowUser is loading', () => {
    mockUseUnfollowUserMutation = jest.fn().mockReturnValue([mockUnfollowUser, { loading: true }]);
    render(<FollowButton targetUserId="1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Unfollowing...');
  });
  it('handles follow response without success or pending status', async () => {
    mockFollowUser.mockResolvedValueOnce({
      data: { followUser: { success: false, request: null } },
    });
    render(<FollowButton targetUserId="1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(mockFollowUser).toHaveBeenCalledWith({ variables: { targetUserId: '1' } });
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Follow');
    });
  });
  it('handles unfollow response without success', async () => {
    mockUnfollowUser.mockResolvedValueOnce({
      data: { unfollowUser: { success: false } },
    });
    render(<FollowButton targetUserId="1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="testUser" />);
    fireEvent.click(screen.getByTestId('follow-btn-1'));
    await waitFor(() => {
      expect(mockUnfollowUser).toHaveBeenCalledWith({ variables: { targetUserId: '1' } });
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.getByTestId('follow-btn-1')).toHaveTextContent('Following');
    });
  });
});
