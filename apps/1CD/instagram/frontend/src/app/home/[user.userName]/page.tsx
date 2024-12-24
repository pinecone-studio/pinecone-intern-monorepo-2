'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { useGetFollowersQuery, useGetFollowingsQuery, useGetMyPostsQuery } from '@/generated';

import { Grid3x3, Save, Settings } from 'lucide-react';
import { useState } from 'react';
import ProImg from '@/components/user-profile/ChangeProImg';
import { NoPost } from '@/components/user-profile/NoPost';
import Image from 'next/image';

const UserProfile = () => {
  const { user, changeProfileImg } = useAuth();
  const userId: string = user?._id as string;
  const { data: postData, error: postError } = useGetMyPostsQuery();
  const [proImgData, setProImgData] = useState<string>('');
  const { data: followingData } = useGetFollowingsQuery({ variables: { followerId: userId } });
  const { data: followerData } = useGetFollowersQuery({ variables: { followingId: userId } });
  return (
    <div className="my-10 mx-auto" data-cy="user-profile-page">
      <div className="w-[900px]">
        <div className="flex flex-row justify-evenly mb-10">
          <section>
            <ProImg changeProfileImg={changeProfileImg} proImgData={proImgData} setProImgData={setProImgData} _id={user?._id} prevProImg={user?.profileImg || ''} />
          </section>
          <div className="flex flex-col justify-between">
            <div className="flex flex-row items-center space-x-8">
              <h1 className="font-bold text-2xl" data-cy="username">
                {user?.userName}
              </h1>
              <Button className="text-black bg-gray-200 hover:bg-gray-300 h-8">Edit Profile</Button>
              {/* <Button className="text-black bg-gray-200 hover:bg-gray-300 h-8">Add tools</Button> */}
              <div>
                <Settings />
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-row items-center space-x-2">
                <div className="font-semibold">
                  {/* {loading && <Skeleton className="h-4 w-10" />} */}
                  {postError && (
                    <p className="font-normal" data-cy="postnumberError">
                      Something wrong
                    </p>
                  )}
                  <h1 className="font-semibold" data-cy="postNumberDone">
                    {postData?.getMyPosts.length}
                  </h1>
                </div>
                <p>posts</p>
              </div>
              <div className="flex flex-row space-x-2">
                <h1 className="font-semibold" data-cy="followerNumber">
                  {followerData?.seeFollowers.length}
                </h1>
                <p>followers</p>
              </div>
              <div className="flex flex-row space-x-2">
                <h1 className="font-semibold" data-cy="followingNumber">
                  {/* {followingData?.seeFollowings.length} */}
                  {followingData?.seeFollowings.length}
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
        <div className="border-t-4 border-t-gray-200 flex relative">
          <div className="text-black border-black pt-4 flex flex-row space-x-1 items-center border-t-4  absolute -top-1 left-[40%]">
            <Grid3x3 />
            <p>POSTS</p>
          </div>
          <div className="text-gray-400 pt-4 flex flex-row space-x-1 items-center border-t-4  absolute -top-1 right-[40%]">
            <Save />
            <p>SAVED</p>
          </div>
        </div>
        <div className="mt-16">
          {/* {loading && <Skeleton className="h-[75vh] w-full" />} */}
          {postError && (
            <p className="font-normal" data-cy="postsError">
              Something wrong
            </p>
          )}
          {postData?.getMyPosts.length === 0 && <NoPost />}
          <div className="grid grid-cols-3 gap-3 " data-cy="myPosts">
            {postData?.getMyPosts.map((myOnePost) => (
              <section key={myOnePost._id} className="relative h-[292px]" data-cy="myPost">
                <Image src={myOnePost.images[0]} alt="postnii-zurag" fill className="absolute object-cover" />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
