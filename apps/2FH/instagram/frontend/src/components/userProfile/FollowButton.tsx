'use client';

import { useState } from 'react';
import { useFollowUserMutation, useUnfollowUserMutation, useGetUserByUsernameQuery } from '@/generated';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  initialIsRequested: boolean;
  isPrivate: boolean;
  userName: string;
}

export const FollowButton = ({ targetUserId, initialIsFollowing, initialIsRequested, isPrivate, userName }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isRequested, setIsRequested] = useState(initialIsRequested);
  const { refetch } = useGetUserByUsernameQuery({ variables: { userName: userName } });
  const { user: currentUser, updateUser } = useAuth();
  const { refetch: refetchCurrentUser } = useGetUserByUsernameQuery({
    variables: { userName: currentUser?.userName || '' },
    skip: !currentUser?.userName,
  });

  const [followUser, { loading: followLoading }] = useFollowUserMutation();
  const [unfollowUser, { loading: unfollowLoading }] = useUnfollowUserMutation();

  const handleFollowSuccess = (data: unknown) => {
    const followData = data as { followUser?: { request?: { status: string }; success?: boolean } };
    if (followData?.followUser?.request?.status === 'PENDING') {
      setIsRequested(true);
    } else if (followData?.followUser?.success) {
      setIsFollowing(true);
    }
  };

  const handleUnfollowSuccess = (data: unknown) => {
    const unfollowData = data as { unfollowUser?: { success?: boolean } };
    if (unfollowData?.unfollowUser?.success) {
      setIsFollowing(false);
      setIsRequested(false);
    }
  };

  const updateCurrentUserData = async () => {
    if (!currentUser?.userName) return;

    const { data: currentUserData } = await refetchCurrentUser();
    if (currentUserData?.getUserByUsername) {
      const userData = currentUserData.getUserByUsername;
      updateUser({
        _id: userData._id,
        fullName: userData.fullName,
        userName: userData.userName,
        isVerified: userData.isVerified,
        followers: userData.followers as unknown as { _id: string; userName: string; fullName: string; profileImage?: string | undefined }[],
        followings: userData.followings as unknown as { _id: string; userName: string; fullName: string; profileImage?: string | undefined }[],
      });
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await followUser({ variables: { targetUserId } });
      refetch();
      await updateCurrentUserData();
      handleFollowSuccess(data);
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const { data } = await unfollowUser({ variables: { targetUserId } });
      refetch();
      await updateCurrentUserData();
      handleUnfollowSuccess(data);
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  const getButtonText = () => {
    const states = [
      { condition: followLoading, text: 'Following...' },
      { condition: unfollowLoading, text: 'Unfollowing...' },
      { condition: isFollowing, text: 'Following' },
      { condition: isRequested, text: 'Requested' },
    ];

    for (const state of states) {
      if (state.condition) return state.text;
    }

    return isPrivate ? 'Follow Request' : 'Follow';
  };

  const getConfigKey = () => {
    if (isFollowing) return 'following';
    if (isRequested) return 'requested';
    return 'default';
  };

  const getButtonConfig = () => {
    const configs = {
      following: {
        onClick: handleUnfollow,
        disabled: unfollowLoading,
        className: 'px-3 py-1.5 text-sm rounded-lg bg-neutral-200 hover:bg-neutral-300 transition-colors text-black',
      },
      requested: {
        disabled: true,
        className: 'px-3 py-1.5 text-sm rounded-lg bg-neutral-200 text-gray-600',
      },
      default: {
        onClick: handleFollow,
        disabled: followLoading,
        className: 'px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors',
      },
    };

    return configs[getConfigKey() as keyof typeof configs];
  };

  const buttonProps = getButtonConfig();

  return (
    <button {...buttonProps} data-testid={`follow-btn-${targetUserId}`}>
      {getButtonText()}
    </button>
  );
};
