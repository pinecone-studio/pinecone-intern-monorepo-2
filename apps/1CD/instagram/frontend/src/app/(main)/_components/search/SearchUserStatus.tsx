'use client';
import React from 'react';
import { useAuth } from '../../../../components/providers';
import { useGetFollowStatusQuery } from '@/generated';
import { Dot } from 'lucide-react';

export const SearchUserStatus = ({ userId }: { userId: string }) => {
  const { user } = useAuth();

  const { data: followData } = useGetFollowStatusQuery({
    variables: {
      followerId: user?._id as string,
      followingId: userId as string,
    },
  });

  const buttonText = followData?.getFollowStatus?.status === 'APPROVED' ? 'Following' : followData?.getFollowStatus?.status === 'PENDING' ? 'Requested' : '';

  return (
    <div className="flex items-center">
      <Dot className={`w-3 ${buttonText === '' ? 'hidden' : 'block'}`} />
      <span className={`text-xs text-[#71717A]`}>{buttonText}</span>
    </div>
  );
};
