'use client';
import React from 'react';
import Image from 'next/image';
import { useAuth } from '../../../../components/providers';
import Link from 'next/link';
import { SuggestUser } from './SuggestUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type myStoriesType =
  | {
      endDate: string;
      createdAt: Date;
      _id: string;
      image: string;
    }[]
  | undefined;

export const UserBar = ({ myStories }: { myStories: myStoriesType }) => {
  const { signout, user } = useAuth();

  return (
    <div data-testid="user-bar" className="w-[326px] flex flex-col gap-4  pt-10 ">
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          {myStories ? (
            <Link href={`/mystories/${user?._id}`}>
              <div className="rounded-full w-fit bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
                <div className="rounded-full bg-white w-[60px] h-[60px] flex items-center justify-center">
                  <Avatar className="w-[56px] h-[56px]">
                    <AvatarImage src={user?.profileImg || '/images/profileImg.webp'} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </Link>
          ) : (
            <Link href={`/home/${user?.userName}`}>
              <div className="relative flex rounded-full w-14 h-14">
                <Image fill={true} src={user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
              </div>
            </Link>
          )}

          <div className="">
            <h1 className="text-sm font-bold ">{user?.userName}</h1>
            <p className="text-[12px] text-gray-500 ">{user?.fullName}</p>
          </div>
        </div>

        <div>
          <button className="text-[11px] font-bold text-[#2563EB]" data-testid="logoutBtn" onClick={signout}>
            Log out
          </button>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <p className="text-gray-500">Suggestions for you</p>
        <Link href="/home/suggestuser" className="">
          See All
        </Link>
      </div>
      <SuggestUser />
      <div className="text-gray-500 text-wrap text-[12px] flex flex-col gap-4 mt-8">
        <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified</p>
        <p>© 2024 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};
