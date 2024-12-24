'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Тасалбар',
    link: '/admin/home',
  },
  {
    name: 'Цуцлах хүсэлт',
    link: '/admin/cancel-request',
  },
  {
    name: 'Артист',
    link: '/admin/',
  },
];

export const AdminHeader = () => {
  const [activeLink, setActiveLink] = useState('/home');

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className="z-10 px-4 py-4 text-black bg-white max-w-[1600px] min-w-[310px] md:flex-row md:px-12 md:py-6 md:gap-0  mx-auto border-b-2 border-slate-200 max-h-[108px]">
      <div className="flex justify-between w-[1600px] mb-5">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="size-8 bg-sky-400 rounded-full"></div>
          <p className="text-4xl ">TICKET BOOKING</p>
        </div>
        <div>
          {/* <User /> */}
          <Button>
            Гарах
          </Button>
        </div>
      </div>

      <div className="text-black flex gap-6">
        {navigation.map((nav) => (
          <Link
            key={nav.link}
            href={nav.link}
            className={`relative ${
              activeLink === nav.link ? 'font-bold text-black' : 'text-gray-800'
            }`}
            onClick={() => handleLinkClick(nav.link)}
          >
            {nav.name}
            {activeLink === nav.link && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};