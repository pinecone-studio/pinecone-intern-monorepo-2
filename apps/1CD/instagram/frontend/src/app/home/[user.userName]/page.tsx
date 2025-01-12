'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { useGetFollowersQuery, useGetFollowingsQuery, useGetMyPostsQuery } from '@/generated';
import { Grid3x3, Settings } from 'lucide-react';
import { useState } from 'react';
import ProImg from '@/components/user-profile/ChangeProImg';
import { NoPost } from '@/components/user-profile/NoPost';
import FollowerDialog from '@/app/(main)/_components/follow/FollowerDialog';
import FollowingDialog from '@/app/(main)/_components/follow/FollowingDialog';
import { PostImgCard } from '@/app/(main)/_components/post/PostImgCard';
import Link from 'next/link';

const UserProfile = () => {
  const { user, changeProfileImg } = useAuth();
  const userId: string = user?._id as string;
  const { data: postData } = useGetMyPostsQuery();
  const [proImgData, setProImgData] = useState<string>('');
  const { data: followingData } = useGetFollowingsQuery({ variables: { followerId: userId } });
  const { data: followerData } = useGetFollowersQuery({ variables: { followingId: userId } });
  if (!followingData || !followerData || !postData) return;

  const fetchedFollowerData = followerData?.seeFollowers?.map((oneFollower) => ({
    _id: oneFollower.followerId._id,
    userName: oneFollower.followerId.userName,
    profileImg: oneFollower.followerId.profileImg || '/images/profileImg.webp',
    fullName: oneFollower.followerId.fullName,
  }));

  const fetchedFollowingData = followingData.seeFollowings.map((oneFollowing) => ({
    _id: oneFollowing.followingId._id,
    userName: oneFollowing.followingId.userName,
    fullName: oneFollowing.followingId.fullName,
    profileImg: oneFollowing.followingId.profileImg || '/images/profileImg.webp',
  }));
  const postDiv = () => {
    if (postData.getMyPosts.length)
      return (
        <div className="grid grid-cols-3 gap-3 " data-cy="myPosts">
          {postData?.getMyPosts.map((myOnePost) => (
            <section key={myOnePost._id} className="relative h-[292px]" data-cy="myPost">
              <PostImgCard image={myOnePost?.images[0]} id={myOnePost?._id} />
            </section>
          ))}
        </div>
      );
    else return <NoPost data-cy="zeroPost" />;
  };
  return (
    <div className="mx-auto my-10" data-cy="user-profile-page">
      <div className="w-[900px]">
        <div className="flex flex-row mb-10 justify-evenly">
          <ProImg changeProfileImg={changeProfileImg} proImgData={proImgData} setProImgData={setProImgData} _id={user?._id} prevProImg={user?.profileImg || '/images/profileImg.webp'} />

          <div className="flex flex-col justify-between">
            <div className="flex flex-row items-center space-x-8">
              <h1 className="text-2xl font-bold" data-cy="username">
                {user?.userName}
              </h1>
              <Link href={`/home/editProfile`}>
                <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Edit Profile</Button>
              </Link>

              {/* <Button className="h-8 text-black bg-gray-200 hover:bg-gray-300">Add tools</Button> */}
              <div>
                <Settings />
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div className="flex flex-row items-center space-x-2">
                <h1 className="flex justify-center font-semibold" data-cy="postNumberDone">
                  {postData.getMyPosts.length}
                </h1>
                <p>posts</p>
              </div>
              <FollowerDialog followerDataCount={followerData.seeFollowers.length} followerData={fetchedFollowerData} />
              <FollowingDialog followingDataCount={followingData.seeFollowings.length} followingData={fetchedFollowingData} />
            </div>
            <div>
              <h1 className="font-bold" data-cy="fullname">
                {user?.fullName}
              </h1>
              <p>{user?.bio}</p>
            </div>
          </div>
        </div>
        <div className="relative flex border-t-4 border-t-gray-200">
          <div className="text-black border-black pt-4 flex flex-row space-x-1 items-center border-t-4  absolute -top-1 left-[45%]">
            <Grid3x3 />
            <p>POSTS</p>
          </div>
          {/* <div className="text-gray-400 pt-4 flex flex-row space-x-1 items-center border-t-4  absolute -top-1 right-[40%]">
            <Save />
            <p>SAVED</p>
          </div> */}
        </div>
        <div className="mt-16" data-cy="postSection">
          {postDiv()}
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
