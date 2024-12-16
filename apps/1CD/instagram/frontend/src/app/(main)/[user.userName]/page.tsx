'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { FaTableCells } from 'react-icons/fa6';
import { HiSave } from 'react-icons/hi';
import Image from 'next/image';
import { IoIosSettings } from 'react-icons/io';

import { useGetMyPostsQuery } from '@/generated';
import { NoPost } from '@/components/user-profile/NoPost';

const UserProfile = () => {
  const { user } = useAuth();

  const { data, error } = useGetMyPostsQuery();

  return (
    <div className="my-10 mx-auto" data-cy="user-profile-page">
      <div className="w-[900px]">
        <div className="flex flex-row justify-evenly mb-10">
          <section>
            <div className="relative w-36 h-36 rounded-full">
              <Image src={user?.profileImg ? user.profileImg : '/images/Logo.png'} alt="profilezurag" fill className="absolute rounded-full" data-cy="proImage" />
            </div>
          </section>
          <div className="flex flex-col justify-between">
            <div className="flex flex-row items-center space-x-4">
              <h1 className="font-bold text-2xl" data-cy="username">
                {user?.userName}
              </h1>
              <Button className="text-black bg-gray-200 hover:bg-gray-300 h-8">Edit Profile</Button>
              <Button className="text-black bg-gray-200 hover:bg-gray-300 h-8">Add tools</Button>
              <div>
                <IoIosSettings className="text-2xl" />
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-row items-center space-x-2">
                <div className="font-semibold">
                  {/* {loading && <Skeleton className="h-4 w-10" />} */}
                  {error && (
                    <p className="font-normal" data-cy="postnumberError">
                      Something wrong
                    </p>
                  )}
                  <h1 className="font-normal" data-cy="PostNumberDone">
                    {data?.getMyPosts.length}
                  </h1>
                </div>
                <p>posts</p>
              </div>
              <div className="flex flex-row space-x-2" data-cy="followerNumber">
                <h1 className="font-semibold">{user?.followerCount}</h1>
                <p>followers</p>
              </div>
              <div className="flex flex-row space-x-2" data-cy="followingNumber">
                <h1 className="font-semibold">{user?.followingCount}</h1>
                <p>following</p>
              </div>
            </div>
            <div>
              <h1 className="font-bold" data-cy="fullname">
                {user?.fullName}
              </h1>
              <p>{user?.bio}энэ хэсэг дээр био дэлгэрэнгүй байна</p>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-t-gray-200 flex relative">
          <div className="text-gray-400 pt-4 flex flex-row space-x-1 items-center border-t-2 hover:border-t-black hover:text-black absolute -top-1 left-[40%]">
            <FaTableCells />

            <p>POSTS</p>
          </div>
          <div className="text-gray-400 pt-4 flex flex-row space-x-1 items-center border-t-2 hover:border-t-black hover:text-black absolute -top-1 right-[40%]">
            <HiSave className="text-xl" />
            <p>SAVED</p>
          </div>
        </div>
        <div className="mt-14" data-cy="posts">
          {/* {loading && <Skeleton className="h-[75vh] w-full" />} */}
          {error && (
            <p className="font-normal" data-cy="postsError">
              Something wrong
            </p>
          )}
          {data?.getMyPosts.length === 0 && <NoPost data-cy="postNoData" />}
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
