'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpenCheck, Heart, House, ImagePlus, Search, SquarePlus } from 'lucide-react';
import Image from 'next/image';
import { UpdateImagesStep1 } from '../post/UpdateImagesStep1';
import { useAuth } from '../providers';

export const MenuBar = ({ hide, setHide }: { hide: boolean; setHide: Dispatch<SetStateAction<boolean>> }) => {
  const { user } = useAuth();
  const items = [
    {
      name: 'Search',
      icon: <Search />,
      href: '/home',
    },
    {
      name: 'Notifications',
      icon: <Heart />,
      href: '/home',
    },
  ];

  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  return (
    <nav className={`grid items-start  gap-2 text-sm`} data-testid="MenuBar">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className={'flex items-center gap-4 overflow-hidden  rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}
              data-testid="menuBtn1"
              onClick={() => {
                if (hide === true) {
                  setHide(false);
                }
              }}
            >
              <p>
                <House />
              </p>

              <p className={`${hide ? 'hidden' : ''}`}>Home</p>
            </Link>
          </TooltipTrigger>

          {items.map((item, i) => {
            return (
              <TooltipTrigger key={i} asChild>
                <Link
                  href={item.href}
                  className={'flex items-center gap-4 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}
                  data-testid="hideIconBtn"
                  onClick={() => {
                    if (hide === true) {
                      setHide(false);
                    }
                    if (hide === false) {
                      setHide(true);
                    }
                  }}
                >
                  <p>{item.icon}</p>

                  <p className={`${hide ? 'hidden' : ''}`}>{item.name}</p>
                </Link>
              </TooltipTrigger>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild data-testid="moreCreateBtn">
              <div className={'flex items-center gap-4 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer'}>
                <p>
                  <SquarePlus />
                </p>

                <p className={`${hide ? 'hidden' : ''}`}>Create</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem className="flex items-center justify-between" data-testid="CreatePostBtn" onClick={() => setOpenCreatePostModal(true)}>
                <p>Post</p>
                <p className="">
                  <ImagePlus width={18} height={20} />
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <p>Story</p>
                <p>
                  <BookOpenCheck width={18} height={20} />
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipTrigger>
            <Link
              href="/home"
              className={'flex items-center gap-4 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'}
              data-testid="menuBtn2"
              onClick={() => {
                if (hide === true) {
                  setHide(false);
                }
              }}
            >
              <div className="relative w-6 h-6 rounded-full">
                <Image fill={true} src={user?.profileImg || '/images/profileImg.webp'} className="w-auto h-auto rounded-full" alt="Profile-img" sizes="w-auto h-auto" priority />
              </div>

              <p className={`${hide ? 'hidden justify-center' : ''} `}>Profile</p>
            </Link>
          </TooltipTrigger>
        </Tooltip>
        <UpdateImagesStep1 openCreatePostModal={openCreatePostModal} setOpenCreatePostModal={setOpenCreatePostModal} />
      </TooltipProvider>
    </nav>
  );
};
