'use client';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const FOLLOW_USER = gql`
  mutation FollowUser($targetUserId: ID!) {
    followUser(targetUserId: $targetUserId) {
      success
      message
      request {
        status
      }
    }
  }
`;

export const FollowButton = ({ targetUserId, initialIsFollowing, initialIsRequested }: { targetUserId: string; initialIsFollowing: boolean; initialIsRequested: boolean; isPrivate: boolean }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isRequested, setIsRequested] = useState(initialIsRequested);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMutationCompleted = (data: any) => {
    const result = data?.followUser;
    if (result?.request?.status === 'PENDING') {
      setIsRequested(true); // Private → Requested
    } else if (result?.success) {
      setIsFollowing(true); // Public → Following
    }
  };

  const handleMutationError = (err: Error) => {
    console.error('Follow mutation error:', err);
  };

  const [followUser, { loading }] = useMutation(FOLLOW_USER, {
    onCompleted: handleMutationCompleted,
    onError: handleMutationError,
  });

  const handleFollow = () => {
    followUser({ variables: { targetUserId } });
  };

  const getButtonClassName = () => {
    if (isFollowing) return 'bg-neutral-200 text-black hover:bg-neutral-300';
    if (isRequested) return 'bg-neutral-200 text-gray-600 cursor-default';
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  const getButtonText = () => {
    if (loading) return '...';
    if (isFollowing) return 'Following';
    if (isRequested) return 'Requested';
    return 'Follow';
  };

  return (
    <button onClick={handleFollow} disabled={loading || isRequested} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${getButtonClassName()}`} data-testid={`follow-btn-${targetUserId}`}>
      {getButtonText()}
    </button>
  );
};
