'use client';
import { useAuth } from '@/components/providers';
import { useGetFollowingsQuery, useGetSuggestUserQuery } from '@/generated';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FollowBtnSuggest } from './FollowBtnSuggest';

export const SuggestUser = () => {
  const { user } = useAuth();
  const { data } = useGetSuggestUserQuery();
  const { data: data1 } = useGetFollowingsQuery({
    variables: {
      followerId: user?._id || '',
    },
  });
  const followingsOfMyFollowings = data?.getSuggestUser;
  const myFollowingInfo = data1?.seeFollowings;
  const SuggestFollowingsWithUser = followingsOfMyFollowings?.filter((item) => !myFollowingInfo?.map((i) => String(i.followingId._id)).includes(String((item?.followingId as any)._id)));

  const SuggestFollowerDuplicate = SuggestFollowingsWithUser?.filter((item) => String((item?.followingId as any)._id) !== user?._id);
  const SuggestUser = SuggestFollowerDuplicate?.filter((obj, index, self) => index === self.findIndex((t) => t?.followingId._id === obj?.followingId._id));
  return (
    <>
      {SuggestUser?.slice(-8).map((user, index) => {
        return (
          <div key={`key ${index} ${user?.followerId._id}`} data-testid="suggest-user-comp" className="flex items-center justify-between w-full">
            <Link href={`/home/viewprofile/${user?.followingId._id}`} className="flex items-center gap-2">
              <div className="relative flex w-8 h-8 rounded-full">
                <Image fill={true} src={user?.followingId.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
              </div>
              <div className="">
                <h1 className="text-sm font-bold ">{user?.followingId.userName}</h1>
                <p className="text-[12px] text-gray-500 ">followed by {user?.followerId.userName}</p>
              </div>
            </Link>
            <div>
              {/* <button className="text-[11px] font-bold text-[#2563EB]">Follow</button> */}
              <FollowBtnSuggest userId={user?.followingId?._id || ''} />
            </div>
          </div>
        );
      })}
    </>
  );
};
