import React from 'react';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { OtherUser } from '@/generated';

const HeadingSection = ({
  profileUser,
  followLoading,
  buttonState,
  handleFollowClick,
}: {
  profileUser: OtherUser | undefined;
  followLoading: boolean;
  buttonState: string;
  handleFollowClick: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-row mb-10 justify-evenly">
      <section>
        <img
          data-testid="proImage"
          src={
            profileUser?.profileImg ||
            'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
          }
          alt="profilezurag"
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
          <Button
            className={`h-8 text-black ${buttonState === 'Follow' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-300'}`}
            onClick={handleFollowClick}
            disabled={followLoading || buttonState !== 'Follow'}
          >
            {followLoading ? 'Loading...' : buttonState}
          </Button>
          <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Message</Button>
          <div>
            <Ellipsis />
          </div>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="flex flex-row items-center space-x-2">
            <p>0 posts</p>
          </div>
          <div className="flex flex-row space-x-2">
            <h1 className="font-semibold" data-cy="followerNumber">
              {profileUser?.followerCount}
            </h1>
            <p>followers</p>
          </div>
          <div className="flex flex-row space-x-2">
            <h1 className="font-semibold" data-cy="followingNumber">
              {profileUser?.followingCount}
            </h1>
            <p>following</p>
          </div>
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
