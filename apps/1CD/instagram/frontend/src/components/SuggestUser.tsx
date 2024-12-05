'use client';
import Image from 'next/image';
import React from 'react';

export const SuggestUser = () => {
  return (
    <div className="flex items-center justify-between w-[121px]">
      <div className="flex items-center gap-2">
        <div className="relative flex rounded-full w-14 h-14">
          <Image fill={true} src="/images/img.avif" alt="Photo1" className="w-auto h-auto rounded-full" />
        </div>
        <div className="">
          <h1 className="text-sm font-bold ">defavours_11</h1>
          <p className="text-sm text-gray-500 ">follows you</p>
        </div>
      </div>
      <div>
        <button className="text-sm font-bold text-[#2563EB]">Follow</button>
      </div>
    </div>
  );
};
