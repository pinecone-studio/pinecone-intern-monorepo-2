'use client';
import React from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { Instagram } from 'lucide-react';

export const MenuBar = ({ hide }: { hide: boolean }) => {
  return (
    <div className="p-5 pt-10 ">
      <Link href="/home" className="">
        <div className={`relative w-[100px] h-[30px] flex items-center `}>
          <Image alt="Logo" src="/images/Logo.png" fill={true} className={`w-auto h-auto ${hide ? 'hidden' : ''}  `} sizes="w-auto h-auto" priority />
          <p className={` ${hide ? 'pl-2 inline-flex justify-center' : 'hidden'} text-2x  `}>
            {' '}
            <Instagram />
          </p>
        </div>
      </Link>
    </div>
  );
};
