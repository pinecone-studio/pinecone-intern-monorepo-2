'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuBar } from '../../../components/header/MenuBar';
import Image from 'next/image';

import { BookOpenCheck, Heart, House, ImagePlus, SquarePlus, Search } from 'lucide-react';
import SearchFromAllUsers from '@/app/(main)/_components/SearchComponent';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UpdateImagesStep1 } from '../../../components/post/UpdateImagesStep1';
import { useAuth } from '../../../components/providers';

export const Header = () => {
  const [hide, setHide] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [showSearchComponent, setShowSearchComponent] = useState(false);

  const { user } = useAuth();

  const hideSideBar = () => setHide((prev) => !prev);

  const renderNavLink = (icon: React.ReactNode, label: string, onClick: () => void, testId: string) => (
    <div onClick={onClick} className="flex items-center gap-4 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground" data-testid={testId}>
      <p>{icon}</p>
      <p className={`${hide ? 'hidden' : ''}`}>{label}</p>
    </div>
  );

  return (
    <>
      <aside data-testid="header" className={`relative h-screen flex-none border-r bg-card ${hide ? 'w-20' : 'w-[260px]'} overflow-hidden`}>
        <MenuBar hide={hide} />

        <div className="mt-12 px-7">
          <nav className="grid items-start gap-2 text-sm" data-testid="MenuBar">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{renderNavLink(<House />, 'Home', hideSideBar, 'menuBtn1')}</TooltipTrigger>

                <TooltipTrigger asChild>
                  {renderNavLink(
                    <Search />,
                    'Search',
                    () => {
                      setShowSearchComponent(!showSearchComponent);
                      hideSideBar();
                    },
                    'searchBtn'
                  )}
                </TooltipTrigger>

                <TooltipTrigger asChild>
                  {renderNavLink(
                    <Heart />,
                    'Notification',
                    () => {
                      setShowSearchComponent(false);
                      hideSideBar();
                    },
                    'menuBtn3'
                  )}
                </TooltipTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild data-testid="moreCreateBtn">
                    <div className={'flex items-center gap-4 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer'}>
                      <p>
                        <SquarePlus />
                      </p>
                      <p>Create</p>
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
                    href={`/home/${user?.userName}`}
                    className="flex items-center gap-4 py-2 overflow-hidden text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    data-testid="menuBtn2"
                    data-cy="userProfileButton"
                    onClick={() => {
                      setShowSearchComponent(false);
                      hideSideBar();
                    }}
                  >
                    <div className="relative w-6 h-6 rounded-full">
                      <Image fill src={user?.profileImg || '/images/profileImg.webp'} className="w-auto h-auto rounded-full object-cover" alt="Profile-img" priority />
                    </div>
                    <p className={`${hide ? 'hidden justify-center' : ''}`}>Profile</p>
                  </Link>
                </TooltipTrigger>
              </Tooltip>

              <UpdateImagesStep1 data-testid="UpdateImagesStep1" openCreatePostModal={openCreatePostModal} setOpenCreatePostModal={setOpenCreatePostModal} />
            </TooltipProvider>
          </nav>
        </div>
      </aside>

      {showSearchComponent && (
        <div className="" data-testid="search-users-component">
          <SearchFromAllUsers />
        </div>
      )}
    </>
  );
};
