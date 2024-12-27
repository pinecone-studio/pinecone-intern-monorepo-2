'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';
import { useAuth } from '@/components/providers';
import { User } from 'lucide-react';

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
  const { user, signout } = useAuth();
  const [activeLink, setActiveLink] = useState('/home');

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const exitAccount = () => {
    signout();
  };

  return (
    <div className="px-4 py-4 text-black bg-white max-w-[1600px] min-w-[310px] mx-auto max-h-[108px] my-10 md:flex flex-col md:px-12 md:py-6 md:gap-6 lg:px-16 lg:gap-8">
      <div data-cy="AdminHeader-Logo-Text" className="flex justify-between w-full mb-5">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="w-8 h-8 bg-sky-400 rounded-full"></div>
          <h1 className="text-4xl">TICKET BOOKING</h1>
        </div>
        <div>
          <Menubar data-cy="AdminHeader-MenuBar-Button">
            <MenubarMenu>
              <MenubarTrigger>
                <User />
              </MenubarTrigger>
              <MenubarContent data-cy="AdminHeader-MenuBar-Content-Button-One">
                <MenubarItem data-cy="">
                  <div>
                    Profile
                    {user?.email}
                  </div>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem data-cy="AdminHeader-MenuBar-Content-Button-Two">
                  <div onClick={exitAccount}>
                    Exit
                  </div>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div data-cy="AdminHeader-Navigation-link" className="text-white flex gap-10">
        {navigation.map((nav) => (
          <Link key={nav.link} href={nav.link} className={`relative ${activeLink === nav.link ? 'font-bold text-black' : 'text-gray-800'}`} onClick={() => handleLinkClick(nav.link)}>
            {nav.name}
            {activeLink === nav.link && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-orange" />}
          </Link>
        ))}
      </div>

      <div className="border-b-2 border-slate-200"></div>
    </div>
  );
};
