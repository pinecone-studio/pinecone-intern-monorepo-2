'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers';
import { LogOut } from 'lucide-react';

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

export const AdminHeader = () => {
  const [activeLink, setActiveLink] = useState('/home');
  const { user, signout } = useAuth();
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  if (!user || user.role !== 'admin') {
    return <div></div>;
  }

  return (
    <div className="px-4 pt-4 text-black bg-white max-w-[1600px] min-w-[310px] mx-auto max-h-[108px]  md:flex flex-col md:px-12 md:pt-6 md:gap-6 lg:px-16 lg:gap-8 mb-8">
      <div data-cy="AdminHeader-Logo-Text" className="flex justify-between w-full mb-5">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <div className="w-8 h-8 rounded-full bg-sky-400"></div>
          <h1 className="text-4xl">TICKET BOOKING</h1>
        </div>
        <div className="flex items-center gap-2">
          <span data-cy="AdminEmail" data-testid="AdminEmail">
            {user?.email}
          </span>
          <div data-cy="Admin-Header-Exit-Account">
            <Button onClick={() => signout()} className="text-black bg-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div data-cy="AdminHeader-Navigation-link" className="flex gap-10 text-white bg-white">
        {navigation.map((nav, idx) => (
          <Link key={idx} href={nav.link} className={`  ${activeLink === nav.link ? 'font-bold text-black underline underline-offset-8 ' : 'text-gray-800'}`} onClick={() => handleLinkClick(nav.link)}>
            {nav.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
