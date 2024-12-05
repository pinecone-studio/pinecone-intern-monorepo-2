'use client';
import React from 'react';
import Image from 'next/image';

export const UserBar = () => {
  return (
    <div className="flex flex-col items-start justify-between w-[121px] relative h-1/3 bg-card ">
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          <div className="relative flex rounded-full w-14 h-14">
            <Image fill={true} src="/images/img.avif" alt="Photo1" className="w-auto h-auto rounded-full" />
          </div>
          <div className="">
            <h1 className="text-sm font-bold ">defavours_11</h1>
            <p className="text-sm text-gray-500 ">defavours</p>
          </div>
        </div>
        <div>
          <button className="text-sm font-bold text-[#2563EB]">Log out</button>
        </div>
      </div>
      {/* <SuggestUser /> */}
    </div>
  );
};
