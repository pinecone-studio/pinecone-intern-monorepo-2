'use client';
import { BoardSvg } from '@/components/assets/BoardSvg';
import { Posts } from '@/components/userProfile/Post';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { demoImage } from '@/components/userProfile/mock-images';
import { Lock } from 'lucide-react';
import { useGetUserByUsernameQuery } from '@/generated';
import { useAuth, User as AuthUser } from '@/contexts/AuthContext';
import { ProfileInfo } from '../../../components/userProfile/ProfileComponents';
import UserProfile from '../userProfile/page';

interface User {
  followers: Array<{ userName: string; _id: string; profileImage?: string | null | undefined }>;
  followings: Array<{ userName: string; _id: string; profileImage?: string | null | undefined }>;
  _id: string;
  userName: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  isPrivate: boolean;
  isVerified: boolean;
  posts: Array<{ _id: string }>;
}

const checkIfFollowing = (user: User, currentUserId: string | null) => {
  if (!currentUserId) return false;
  return user.followers.some((follower) => follower._id === currentUserId);
};

const ProfilePicture = ({ user }: { user: User }) => (
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

const ProfileContent = ({ user, isFollowing }: { user: User; isFollowing: boolean }) => {
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
    </div>
  );
};

const OtherUserContent = ({ user, currentUser, isFollowing }: { user: User; currentUser: AuthUser | null; isFollowing: boolean }) => (
  <div className="min-h-full w-screen bg-white text-neutral-900 flex justify-center">
    <div className="w-full max-w-[935px] px-4 sm:px-6 pb-16">
      <div className="mt-6 rounded-2xl p-6 sm:p-8">
        <div className="flex gap-6 sm:gap-8">
          <ProfilePicture user={user} />
          <ProfileInfo user={user} currentUser={currentUser} isFollowing={isFollowing} />
        </div>
      </div>
      <div className="border-t">
        <ProfileContent user={user} isFollowing={isFollowing} />
      </div>
    </div>
  </div>
);

const renderUserContent = (user: User, currentUser: AuthUser | null) => {
  if (user._id === currentUser?._id) return <UserProfile />;

  const isFollowing = checkIfFollowing(user, currentUser?._id ?? null);
  return <OtherUserContent user={user} currentUser={currentUser} isFollowing={isFollowing} />;
};

const OtherUser = () => {
  const params = useParams();
  const userName = params.userName as string;
  const { user: currentUser } = useAuth();
  const { data, loading, error } = useGetUserByUsernameQuery({
    variables: { userName },
  });
  const user = data?.getUserByUsername as User | null;

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>User not found</p>;

  return renderUserContent(user, currentUser);
};

export default OtherUser;
