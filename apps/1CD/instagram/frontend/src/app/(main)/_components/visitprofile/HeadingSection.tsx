'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { GetUserPostsQuery, OtherUser } from '@/generated';
import SeeFollowersDialog from './SeeFollowers';
import SeeFollowingsDialog from './SeeFollowings';
import { Follower } from '../follow/FollowerDialog';
import { Following } from '../follow/FollowingDialog';
import Image from 'next/image';

const HeadingSection = ({
  profileUser,
  followLoading,
  buttonText,
  handleButtonClick,
  fetchedFollowerData,
  fetchedFollowingData,
  userPostData,
}: {
  profileUser: OtherUser | undefined;
  followLoading: boolean;
  buttonText: string;
  handleButtonClick: () => Promise<void>;
  fetchedFollowerData: Follower[];
  fetchedFollowingData: Following[];
  userPostData: GetUserPostsQuery | undefined;
}) => {
  return (
    <div className="flex flex-row mb-10 justify-evenly">
      <section>
        <Image
          data-testid="proImage"
          src={
            profileUser?.profileImg ||
            'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
          }
          alt="profile image"
          width="140"
          height="140"
          className="rounded-full w-[140px] h-[140px]"
        />
      </section>
      <div className="flex flex-col justify-between">
        <div className="flex flex-row items-center space-x-4">
          <h1 className="text-2xl font-bold" data-cy="username">
            {profileUser?.userName}
          </h1>
          <Button className={`h-8 text-black bg-gray-200 ${followLoading && 'opacity-50 cursor-not-allowed'}`} onClick={handleButtonClick} disabled={followLoading}>
            {buttonText}
          </Button>
          <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Message</Button>
          <div>
            <Ellipsis />
          </div>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="flex flex-row items-center space-x-2">
            <span className="font-semibold">{userPostData?.getUserPosts?.length}</span>
            {userPostData?.getUserPosts?.length === 1 ? <span>post</span> : <span>posts</span>}{' '}
          </div>

          <SeeFollowersDialog followerData={fetchedFollowerData} followerDataCount={fetchedFollowerData.length} />

          <SeeFollowingsDialog followingData={fetchedFollowingData} followingDataCount={fetchedFollowingData.length} />
        </div>
        <div>
          <h1 className="font-bold" data-cy="fullname">
            {profileUser?.fullName}
          </h1>
          <p>{profileUser?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default HeadingSection;
