'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const { user } = useAuth();
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  if (!user || user.role !== 'admin') {
    return <div></div>;
  }

  return (
    <div className="w-full px-4 pt-4 mx-auto text-black bg-white ">
      <div data-cy="AdminHeader-Logo-Text" className="flex justify-between px-8 py-2 mb-5">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <div className="w-5 h-5 rounded-full bg-sky-400"></div>
          <h1 className="text-2xl">TICKET BOOKING</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={'/admin/home/admin-profile'}>
            <span data-cy="AdminEmail" data-testid="AdminEmail">
              {user?.email}
            </span>
          </Link>
          <div data-cy="Admin-Header-Exit-Account">
            <Link href="/user/sign-in" className="text-black bg-white">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <div data-cy="AdminHeader-Navigation-link" className="flex gap-10 px-12 bg-white">
        {navigation.map((nav, idx) => (
          <Link key={idx} href={nav.link} className={`  ${activeLink === nav.link ? 'border-b-black border-b-2 text-black' : 'text-gray-800'}`} onClick={() => handleLinkClick(nav.link)}>
            {nav.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
