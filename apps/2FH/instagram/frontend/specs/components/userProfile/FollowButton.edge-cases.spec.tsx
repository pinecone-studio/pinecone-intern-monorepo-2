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

describe('FollowButton - Edge Cases', () => {
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

  it('handles updateCurrentUserData when getUserByUsername exists', async () => {
    const mockRefetchCurrentUser = jest.fn().mockResolvedValue({
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
    });

    (useGetUserByUsernameQuery as jest.Mock)
      .mockReturnValueOnce({ refetch: jest.fn(), data: { getUserByUsername: null } })
      .mockReturnValueOnce({ refetch: mockRefetchCurrentUser, data: { getUserByUsername: null } });

    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(mockUpdateUser).toHaveBeenCalled());
  });

  it('handles updateCurrentUserData when currentUser has no userName', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { _id: 'currentUser', userName: null },
      updateUser: mockUpdateUser,
    });

    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('handles updateCurrentUserData when getUserByUsername is null', async () => {
    const mockRefetchCurrentUser = jest.fn().mockResolvedValue({
      data: {
        getUserByUsername: null,
      },
    });

    (useGetUserByUsernameQuery as jest.Mock)
      .mockReturnValueOnce({ refetch: jest.fn(), data: { getUserByUsername: null } })
      .mockReturnValueOnce({ refetch: mockRefetchCurrentUser, data: { getUserByUsername: null } });

    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('handles follow success when request status is not PENDING and success is false', async () => {
    mockFollow.mockResolvedValue({
      data: {
        followUser: {
          success: false,
          request: { status: 'REJECTED' },
        },
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={true} userName="target" />);
    fireEvent.click(screen.getByText('Follow Request'));
    await waitFor(() => expect(screen.getByText('Follow Request')).toBeInTheDocument());
  });

  it('handles follow success when followUser data is null', async () => {
    mockFollow.mockResolvedValue({
      data: {
        followUser: null,
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
  });

  it('handles unfollow success when success is false', async () => {
    mockUnfollow.mockResolvedValue({
      data: {
        unfollowUser: {
          success: false,
        },
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
  });

  it('handles unfollow success when unfollowUser data is null', async () => {
    mockUnfollow.mockResolvedValue({
      data: {
        unfollowUser: null,
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
  });
});
