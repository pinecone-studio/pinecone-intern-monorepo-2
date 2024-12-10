'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiHome } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FiSearch } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineAddBox } from 'react-icons/md';
import Image from 'next/image';
import { CiImageOn } from 'react-icons/ci';
import { LuBookOpenCheck } from 'react-icons/lu';

export const MenuBar = ({ hide, setHide }: { hide: boolean; setHide: Dispatch<SetStateAction<boolean>> }) => {
  const items = [
    {
      name: 'Search',
      icon: <FiSearch />,
      href: '/',
    },
    {
      name: 'Notifications',
      icon: <FaRegHeart />,
      href: '/',
    },
  ];
  return (
    <nav className="grid items-start gap-2" data-testid="MenuBar">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className={'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}>
              <h1>
                <FiHome />
              </h1>

              <p className={`${hide ? 'hidden' : ''}`}>Home</p>
            </Link>
          </TooltipTrigger>

          {items.map((item, i) => {
            return (
              <TooltipTrigger key={i} asChild>
                <Link
                  href={item.href}
                  className={'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}
                  data-testid="hideIconBtn"
                  onClick={() => {
                    if (hide === true) {
                      setHide(false);
                    }
                    if (hide == false) {
                      setHide(true);
                    }
                  }}
                >
                  <h1>{item.icon}</h1>

                  <p className={`${hide ? 'hidden' : ''}`}>{item.name}</p>
                </Link>
              </TooltipTrigger>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer'}>
                <h1>
                  <MdOutlineAddBox />
                </h1>

                <p className={`${hide ? 'hidden' : ''}`}>Create</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem className="flex items-center justify-between">
                <h1>Post</h1>
                <p>
                  <CiImageOn />
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <h1>Story</h1>
                <p>
                  <LuBookOpenCheck />
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipTrigger>
            <Link href="/" className={'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}>
              <div className="relative w-5 h-5 rounded-full">
                <Image fill={true} src="/images/img1.avif" className="w-auto h-auto rounded-full" alt="Profile-img" />
              </div>

              <p className={`${hide ? 'hidden' : ''}`}>Profile</p>
            </Link>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </nav>
  );
};
