'use client';
import { BoardSvg } from '@/components/assets/BoardSvg';
import { formatNumber } from '@/components/userProfile/format-number';
import { Posts } from '@/components/userProfile/Post';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { demoImage } from '@/components/userProfile/mock-images';
import { BadgeCheck, Lock } from 'lucide-react';
import { FollowButton } from '@/components/userProfile/FollowButton';
import { Followers } from '@/components/userProfile/Followers';
import { useGetUserByUsernameQuery } from '@/generated';

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
interface User {
  followers: Array<{ userName: string }>;
}
interface CurrentUser {
  _id: string;
  userName: string;
}
const checkIfFollowing = (user: User, currentUser: CurrentUser | null) => {
  if (!currentUser) return false;
  return user.followers.some((follower: { userName: string }) => follower.userName === currentUser.userName);
};
const useUserData = (userName: string) => {
  const { data, loading, error } = useGetUserByUsernameQuery({
    variables: { userName },
  });

  return { data, loading, error };
};
const OtherUser = () => {
  const params = useParams();
  const userName = params.userName as string;

  const { data, loading, error } = useUserData(userName);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data?.getUserByUsername;
  if (!user) return <p>User not found</p>;

  const currentUser = getCurrentUser();
  const isFollowing = checkIfFollowing(user, currentUser);
  const renderProfilePicture = () => (
    <div className="shrink-0">
      <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-tr from-fuchsia-500 to-yellow-400">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
          <Image
            src={user.profileImage && (user.profileImage.startsWith('http') || user.profileImage.startsWith('/')) ? user.profileImage : demoImage}
            width={100}
            height={100}
            alt={`${user.userName} profile picture`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
  const renderProfileInfo = () => (
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">{user.userName}</h1>
          {user.isVerified && <BadgeCheck className="text-blue-600" />}
        </div>
        <FollowButton targetUserId={user._id} initialIsFollowing={isFollowing} initialIsRequested={false} isPrivate={user.isPrivate} />
        <button className="px-3 py-1.5 text-sm rounded-lg bg-secondary hover:bg-neutral-200 transition-colors">Message</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <strong className="text-neutral-900 text-xl">10</strong> posts
        </div>
        <div>
          <Followers followers={user.followers} currentUser={currentUser} />
        </div>
        <div>
          <strong className="text-neutral-900 text-xl">{formatNumber(user.followings.length)}</strong> following
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm leading-6">
        <div className="font-semibold">{user.fullName}</div>
        <div>{user.bio}</div>
      </div>
    </div>
  );
  const renderContent = () => {
    if (!user.isPrivate || isFollowing) {
      return (
        <>
          <div className="flex items-center justify-center gap-8 text-xs tracking-wider text-neutral-500 p-4">
            <button className="-mb-px pb-3 border-neutral-900 text-neutral-900 font-semibold flex items-center gap-2">
              <BoardSvg />
              POSTS
            </button>
          </div>
          <Posts />
        </>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="w-14 h-14 flex items-center justify-center rounded-full border border-neutral-400 mb-4">
          <Lock className="w-6 h-6 text-neutral-800" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">This account is private</h2>
        <p className="text-sm text-neutral-500 mb-4">Follow to see their photos and videos</p>
        {/* <FollowButton targetUserId={user._id} initialIsFollowing={isFollowing} initialIsRequested={false} isPrivate={user.isPrivate} /> */}
      </div>
    );
  };
  return (
    <div className="min-h-full w-screen bg-white text-neutral-900 flex justify-center">
      <div className="w-full max-w-[935px] px-4 sm:px-6 pb-16">
        <div className="mt-6 rounded-2xl p-6 sm:p-8">
          <div className="flex gap-6 sm:gap-8">
            {renderProfilePicture()}
            {renderProfileInfo()}
          </div>
        </div>

        {/* Posts эсвэл Private Account хэсэг */}
        <div className="border-t">{renderContent()}</div>
      </div>
    </div>
  );
};
export default OtherUser;
