'use client';
import React from 'react';
import Image from 'next/image';
import { SuggestUser } from '../SuggestUser';
import { useAuth } from '../providers';

export const UserBar = () => {
  const { signout } = useAuth();
  return (
    <div data-testid="user-bar" className="w-[326px] flex flex-col gap-4">
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          <div className="relative flex rounded-full w-14 h-14">
            <Image fill={true} src="/images/img.avif" alt="Photo1" className="w-auto h-auto rounded-full" />
          </div>
          <div className="">
            <h1 className="text-sm font-bold ">defavours_11</h1>
            <p className="text-[12px] text-gray-500 ">quuppp</p>
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
