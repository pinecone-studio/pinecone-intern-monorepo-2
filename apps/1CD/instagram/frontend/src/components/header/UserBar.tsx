'use client';
import React from 'react';
import Image from 'next/image';
import { SuggestUser } from '../../app/(main)/_components/SuggestUser';
import { useAuth } from '../providers';
import Link from 'next/link';

export const UserBar = () => {
  const { signout, user } = useAuth();
  return (
    <div data-testid="user-bar" className="w-[326px] flex flex-col gap-4  pt-10 ">
      <div className="flex items-center justify-between w-full ">
        <Link href={`/home/viewprofile/${user?._id}`} className="flex items-center gap-2">
          <div className="relative flex rounded-full w-14 h-14">
            <Image fill={true} src={user?.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
          </div>
          <div className="">
            <h1 className="text-sm font-bold ">{user?.userName}</h1>
            <p className="text-[12px] text-gray-500 ">{user?.fullName}</p>
          </div>
        </Link>
        <div>
          <button className="text-[11px] font-bold text-[#2563EB]" data-testid="logoutBtn" onClick={signout}>
            Log out
          </button>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <p className="text-gray-500">Suggestions for you</p>
        <button className="">See All</button>
      </div>
      <SuggestUser />
      <div className="text-gray-500 text-wrap text-[12px] flex flex-col gap-4 mt-8">
        <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified</p>
        <p>© 2024 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};
