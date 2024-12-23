'use client';
import { Button } from '@/components/ui/button';
import { useGetOneUserQuery } from '@/generated';
import { Ellipsis, Grid3x3 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';

const ViewProfile = () => {
  const { id } = useParams();

  const { data, error } = useGetOneUserQuery({
    variables: { id: id as string },
    skip: !id,
  });

  const user = data?.getOneUser;
  console.log('userrr', user);

  return (
    <div className="mx-auto my-10" data-cy="visit-profile-page">
      <div className="w-[900px]">
        <div className="flex flex-row mb-10 justify-evenly">
          <section>
            <Image
              data-testid="proImage"
              src={
                user?.profileImg ||
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
                {user?.userName}
              </h1>
              <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Follow</Button>
              <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Message</Button>
              <div>
                <Ellipsis />
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-row items-center space-x-2">
                <div className="font-semibold">
                  {error && (
                    <p className="font-normal" data-cy="postnumberError">
                      Something wrong
                    </p>
                  )}
                  <h1 className="font-normal" data-cy="postNumberDone"></h1>
                </div>
                <p>0 posts</p>
              </div>
              <div className="flex flex-row space-x-2">
                <h1 className="font-semibold" data-cy="followerNumber">
                  {user?.followerCount}
                </h1>
                <p>followers</p>
              </div>
              <div className="flex flex-row space-x-2">
                <h1 className="font-semibold" data-cy="followingNumber">
                  {user?.followingCount}
                </h1>
                <p>following</p>
              </div>
            </div>
            <div>
              <h1 className="font-bold" data-cy="fullname">
                {user?.fullName}
              </h1>
              <p>{user?.bio}</p>
            </div>
          </div>
        </div>
        <div className="relative flex border-t border-t-gray-200">
          <div className=" border-t border-t-black hover:text-black absolute left-[50%]">
            <div className="flex items-center mt-3">
              <Grid3x3 />
              <p>POSTS</p>
            </div>
          </div>
        </div>
        {/* <div className="mt-14">
          {error && (
            <p className="font-normal" data-cy="postsError">
              Something wrong
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ViewProfile;
