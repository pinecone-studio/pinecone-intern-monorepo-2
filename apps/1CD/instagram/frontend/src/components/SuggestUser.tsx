'use client';
import Image from 'next/image';
import React from 'react';

export const SuggestUser = () => {
  return (
    <div data-testid="suggest-user-comp" className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex w-8 h-8 rounded-full">
          <Image fill={true} src="/images/profileImg.webp" alt="Photo1" className="w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
        </div>
        <div className="">
          <h1 className="text-sm font-bold ">defavours_11</h1>
          <p className="text-[12px] text-gray-500 ">follows you</p>
        </div>
      </div>
      <div>
        <button className="text-[11px] font-bold text-[#2563EB]">Follow</button>
      </div>
    </div>
  );
};
