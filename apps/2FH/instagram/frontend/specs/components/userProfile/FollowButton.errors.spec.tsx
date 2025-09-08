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

describe('FollowButton - Error Handling', () => {
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

  it('handles follow error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockFollow.mockRejectedValue(new Error('Follow failed'));
    render(<FollowButton targetUserId="t1" initialIsFollowing={false} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('Follow error:', expect.any(Error)));
    spy.mockRestore();
  });

  it('handles unfollow error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockUnfollow.mockRejectedValue(new Error('Unfollow failed'));
    render(<FollowButton targetUserId="t1" initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName="target" />);
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => expect(spy).toHaveBeenCalledWith('Unfollow error:', expect.any(Error)));
    spy.mockRestore();
  });
});
