'use client';

import React from 'react';
import Link from 'next/link';
import { MenuBar } from './MenuBar';

import Image from 'next/image';

export const Header = () => {
  return (
    <aside className={`relative h-screen flex-none border-r bg-card w-[260px] overflow-hidden`}>
      <div className="p-5 pt-10 ">
        <Link href="/">
          <div className="relative w-[100px] h-[30px]">
            <Image alt="Logo" src="/images/Logo.png" fill={true} className="w-auto h-auto" />
          </div>
        </Link>
      </div>

      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <MenuBar />
          </div>
        </div>
      </div>
    </aside>
  );
};
