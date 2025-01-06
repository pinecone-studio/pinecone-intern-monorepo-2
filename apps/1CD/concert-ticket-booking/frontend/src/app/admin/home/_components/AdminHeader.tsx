'use client';

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
];

export const AdminHeader = ({ onExit }: { onExit?: () => void }) => {
  const [activeLink, setActiveLink] = useState('/home');

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const exitAccount = () => {
    if (onExit) {
      onExit();
    }
  };

  return (
    <div className="px-4 pt-4 text-black bg-white max-w-[1600px] min-w-[310px] mx-auto max-h-[108px]  md:flex flex-col md:px-12 md:pt-6 md:gap-6 lg:px-16 lg:gap-8 mb-8">
      <div data-cy="AdminHeader-Logo-Text" className="flex justify-between w-full mb-5">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="w-8 h-8 bg-sky-400 rounded-full"></div>
          <h1 className="text-4xl">TICKET BOOKING</h1>
        </div>
        <div data-cy="Admin-Header-Exit-Account">
          <Button onClick={exitAccount}>Гарах</Button>
        </div>
      </div>
      <div data-cy="AdminHeader-Navigation-link" className="text-white bg-white flex gap-10">
        {navigation.map((nav, idx) => (
          <Link key={idx} href={nav.link} className={`  ${activeLink === nav.link ? 'font-bold text-black underline underline-offset-8 ' : 'text-gray-800'}`} onClick={() => handleLinkClick(nav.link)}>
            {nav.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
