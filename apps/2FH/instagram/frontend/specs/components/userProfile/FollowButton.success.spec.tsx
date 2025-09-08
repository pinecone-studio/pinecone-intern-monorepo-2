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

describe('FollowButton - Success Cases', () => {
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

  it('handles follow success with success true', async () => {
    mockFollow.mockResolvedValue({ data: { followUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
  });

  it('handles unfollow success with success true', async () => {
    mockUnfollow.mockResolvedValue({ data: { unfollowUser: { success: true } } });
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
  });

  it('handles follow success when request status is not pending and success is true', async () => {
    mockFollow.mockResolvedValue({
      data: {
        followUser: {
          success: true,
          request: { status: 'ACCEPTED' },
        },
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(screen.getByText('Following')).toBeInTheDocument());
  });

  it('handles unfollow success when success is true', async () => {
    mockUnfollow.mockResolvedValue({
      data: {
        unfollowUser: {
          success: true,
        },
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(screen.getByText('Follow')).toBeInTheDocument());
  });

  it('handles follow success when request status is PENDING', async () => {
    mockFollow.mockResolvedValue({
      data: {
        followUser: {
          request: { status: 'PENDING' },
        },
      },
    });
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={true} userName="target" />);
    fireEvent.click(screen.getByText('Follow Request'));
    await waitFor(() => expect(screen.getByText('Requested')).toBeInTheDocument());
  });
});
