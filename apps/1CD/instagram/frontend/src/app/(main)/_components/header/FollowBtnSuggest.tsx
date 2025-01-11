'use client';
import React, { useState } from 'react';
import { useAuth } from '../../../../components/providers';

import { useGetFollowersQuery, useGetFollowingsQuery, useGetFollowStatusQuery, useUnfollowMutation } from '@/generated';
import { useUser } from '@/components/providers/UserProvider';

export const FollowBtnSuggest = ({ userId }: { userId: string }) => {
  const { user } = useAuth();
  const [buttonState, setButtonState] = useState<'Follow'>('Follow');
  const { refetch: FollowingRefetch } = useGetFollowingsQuery({ variables: { followerId: user?._id as string } });
  const { refetch: followerRefetch } = useGetFollowersQuery({ variables: { followingId: user?._id as string } });
  const { data: followData, refetch } = useGetFollowStatusQuery({
    variables: {
      followerId: user?._id as string,
      followingId: userId as string,
    },
  });
  const refresh = async () => {
    await refetch();
  };

  const [unfollowMutation] = useUnfollowMutation({
    onCompleted: () => {
      setButtonState('Follow');
      refresh();
    },
  });
  const { sendFollowReq, followLoading } = useUser();

  const unfollowUser = async ({ _id }: { _id: string }) => {
    if (!followData?.getFollowStatus?._id) {
      console.error('Error: Missing _id for unfollow.');
      return;
    }

    await unfollowMutation({
      variables: {
        id: _id,
        followerId: user?._id as string,
      },
    });
    await FollowingRefetch();
    await followerRefetch();
    await refetch();
  };

  const handleFollowClick = async () => {
    try {
      const { data } = await sendFollowReq({
        variables: {
          followerId: user?._id as string,
          followingId: userId as string,
        },
      });
      await FollowingRefetch();
      await followerRefetch();
      await refetch();
      if (data?.sendFollowReq.status === undefined) {
        setButtonState('Follow');
      }
    } catch (err) {
      throw new Error();
    }
  };

  const buttonText = followData?.getFollowStatus?.status === 'APPROVED' ? 'Following' : followData?.getFollowStatus?.status === 'PENDING' ? 'Requested' : buttonState;

  const handleButtonClick = async () => {
    if ((buttonText === 'Following' || buttonText === 'Requested') && followData?.getFollowStatus?._id) {
      await unfollowUser({ _id: followData.getFollowStatus._id });
    } else if (buttonText === 'Follow') {
      await handleFollowClick();
    }
  };
  return (
    <button className={`text-[11px] font-bold text-[#2563EB]  ${followLoading && 'opacity-50 cursor-not-allowed'}`} onClick={handleButtonClick} disabled={followLoading}>
      {buttonText}
    </button>
  );
};
