/* eslint-disable max-lines */
/* eslint-disable complexity */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuBar } from './header/MenuBar';
import Image from 'next/image';
import { BookOpenCheck, Heart, House, ImagePlus, SquarePlus, Search } from 'lucide-react';
import SearchFromAllUsers from '@/app/(main)/_components/search/SearchComponent';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UpdateImagesStep1 } from '../../../components/post/UpdateImagesStep1';
import { useAuth } from '../../../components/providers';
import { CreateStory } from '@/app/(main)/_components/story/CreateStory';
import { useCreateStoryMutation, useGetNotificationsByLoggedUserQuery } from '@/generated';
import Notification from '@/app/(main)/_components/notification';

export const Header = () => {
  const [hide, setHide] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [openStoryModal, setOpenStoryModal] = useState(false);
  const [storyImg, setStoryImg] = useState('');
  const [showSearchComponent, setShowSearchComponent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);
  const { user } = useAuth();
  const hideSideBar = () => setHide((prev) => !prev);
  const showSideBar = () => setHide(false);
  const { data: notifyData } = useGetNotificationsByLoggedUserQuery();
  const notifyPopupNumber = notifyData?.getNotificationsByLoggedUser.filter((oneNotify) => oneNotify.isViewed === false).length;
  const renderNavLink = (icon: React.ReactNode, label: string, onClick: () => void, testId: string) => (
    <div onClick={onClick} className="flex items-center gap-4 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground" data-testid={testId}>
      <p className="relative">
        {icon}
        {label === 'Notification' && notifyPopupNumber! > 0 && (
          <div className="absolute w-4 h-4 text-sm font-medium text-center text-white bg-red-500 rounded-full -top-2 -right-2">{notifyPopupNumber}</div>
        )}
      </p>
      <p className={`${hide ? 'hidden' : ''}`}>{label}</p>
    </div>
  );
  const [createStory, { loading: StoryUploadLoading }] = useCreateStoryMutation();
  const handleUploadStoryImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingToCloudinary(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'instagram-intern');
    data.append('cloud_name', 'dka8klbhn');

    const res = await fetch('https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', {
      method: 'POST',
      body: data,
    });
    const uploadedImage = await res.json();
    const uploadedImageUrl: string = uploadedImage.secure_url;
    setStoryImg(uploadedImageUrl);
    setUploadingToCloudinary(false);
  };

  const handleCreateStory = async () => {
    if (!storyImg) {
      return;
    }
    await createStory({
      variables: {
        input: {
          image: storyImg,
          user: user?._id || '',
        },
      },
    });
    setStoryImg('');
    setOpenStoryModal(false);
  };

  const discardStory = () => {
    setStoryImg('');
  };

  const isLoading = uploadingToCloudinary || StoryUploadLoading;

  return (
    <>
      <aside data-testid="header" className={`relative h-screen flex-none border-r bg-card ${hide ? 'w-20' : 'w-[260px]'} overflow-hidden`}>
        <MenuBar hide={hide} />
        <div className="mt-12 px-7">
          <nav className="grid items-start gap-2 text-sm" data-testid="MenuBar">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/home">{renderNavLink(<House />, 'Home', showSideBar, 'menuBtn1')}</Link>
                </TooltipTrigger>

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
                      setShowNotification(!showNotification);
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
                    <DropdownMenuItem className="flex items-center justify-between" data-testid="CreateStoryBtn" onClick={() => setOpenStoryModal(true)}>
                      <span>Story</span>
                      <span>
                        <BookOpenCheck width={18} height={20} />
                      </span>
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
                    }}
                  >
                    <div className="relative w-6 h-6 rounded-full">
                      <Image fill src={user?.profileImg || '/images/profileImg.webp'} className="object-cover w-auto h-auto rounded-full" alt="Profile-img" priority sizes="h-auto w-auto" />
                    </div>
                    <p className={`${hide ? 'hidden justify-center' : ''}`}>Profile</p>
                  </Link>
                </TooltipTrigger>
              </Tooltip>
              <UpdateImagesStep1 data-testid="UpdateImagesStep1" openCreatePostModal={openCreatePostModal} setOpenCreatePostModal={setOpenCreatePostModal} />
              <CreateStory
                openStoryModal={openStoryModal}
                setOpenStoryModal={setOpenStoryModal}
                handleUploadStoryImg={handleUploadStoryImg}
                storyImg={storyImg}
                handleCreateStory={handleCreateStory}
                discardStory={discardStory}
                StoryUploadLoading={isLoading}
              />
            </TooltipProvider>
          </nav>
        </div>
      </aside>
      {showSearchComponent && (
        <div className="" data-testid="search-users-component">
          <SearchFromAllUsers setShowSearchComponent={setShowSearchComponent} />
        </div>
      )}
      {showNotification && (
        <div className="" data-testid="notification-component">
          <Notification />
        </div>
      )}
    </>
  );
};
