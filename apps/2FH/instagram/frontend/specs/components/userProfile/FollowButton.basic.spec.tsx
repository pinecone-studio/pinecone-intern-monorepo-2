import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FollowButton } from '@/components/userProfile/FollowButton';
import { useFollowUserMutation, useUnfollowUserMutation, useGetUserByUsernameQuery } from '@/generated';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/generated', () => ({
  useFollowUserMutation: jest.fn(),
  useUnfollowUserMutation: jest.fn(),
  useGetUserByUsernameQuery: jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => ({ useAuth: jest.fn() }));

describe('FollowButton - Basic Functionality', () => {
  const mockFollow = jest.fn();
  const mockUnfollow = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFollowUserMutation as jest.Mock).mockReturnValue([mockFollow, { loading: false }]);
    (useUnfollowUserMutation as jest.Mock).mockReturnValue([mockUnfollow, { loading: false }]);
    (useGetUserByUsernameQuery as jest.Mock).mockReturnValue({
      refetch: jest.fn().mockResolvedValue({
        data: {
          getUserByUsername: {
            _id: 'currentUser',
            userName: 'current',
            fullName: 'Current User',
            email: 'current@example.com',
            profileImage: null,
            bio: null,
            isVerified: true,
            followers: [],
            followings: [],
          },
        },
      }),
      data: { getUserByUsername: null },
    });
    (useAuth as jest.Mock).mockReturnValue({
      user: { _id: 'currentUser', userName: 'current' },
      updateUser: mockUpdateUser,
    });
  });

  it('renders Follow when not following', () => {
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('calls follow mutation and sets state', async () => {
    mockFollow.mockResolvedValue({ data: { followUser: { request: { status: 'PENDING' } } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Requested')).toBeInTheDocument());
  });

  it('sets isRequested true when follow request is pending', async () => {
    mockFollow.mockResolvedValue({ data: { followUser: { request: { status: 'PENDING' } } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={true} userName="target" />);
    fireEvent.click(screen.getByText('Follow Request'));
    await waitFor(() => expect(screen.getByText('Requested')).toBeInTheDocument());
  });

  it('renders Following when already following', () => {
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('calls unfollow mutation and resets state', async () => {
    mockUnfollow.mockResolvedValue({ data: { unfollowUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
  });

  it('updates current user after follow', async () => {
    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(mockUpdateUser).toHaveBeenCalled());
  });

  it('does not update when no userName', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { _id: 'currentUser' }, // No userName
      updateUser: mockUpdateUser,
    });
    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(mockUpdateUser).not.toHaveBeenCalled());
  });

  it('renders Requested state', () => {
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={true} isPrivate={true} userName="target" />);
    expect(screen.getByText('Requested')).toBeInTheDocument();
  });
});
