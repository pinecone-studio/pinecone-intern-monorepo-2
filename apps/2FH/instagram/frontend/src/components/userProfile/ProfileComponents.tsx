import { BadgeCheck } from 'lucide-react';
import { FollowButton } from '@/components/userProfile/FollowButton';
import { Followers } from '@/components/userProfile/Followers';
import { Followings } from '@/components/userProfile/Followings';

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

const UserNameSection = ({ user }: { user: User }) => (
  <div className="flex items-center gap-2">
    <h1 className="text-2xl sm:text-3xl font-semibold">{user.userName}</h1>
    {user.isVerified && <BadgeCheck className="text-blue-600" />}
  </div>
);

const ActionButtons = ({ user, currentUser, isFollowing }: { user: User; currentUser: any; isFollowing: boolean }) => (
  <>
    {currentUser && currentUser._id !== user._id && (
      <FollowButton targetUserId={user._id} userName={user.userName} initialIsFollowing={isFollowing} initialIsRequested={false} isPrivate={user.isPrivate} />
    )}
    {currentUser && currentUser._id !== user._id && <button className="px-3 py-1.5 text-sm rounded-lg bg-secondary hover:bg-neutral-200 transition-colors">Message</button>}
  </>
);

export const ProfileActions = ({ user, currentUser, isFollowing }: { user: User; currentUser: any; isFollowing: boolean }) => (
  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
    <UserNameSection user={user} />
    <ActionButtons user={user} currentUser={currentUser} isFollowing={isFollowing} />
  </div>
);

export const ProfileStats = ({ user, currentUser }: { user: User; currentUser: any }) => (
  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
    <div>
      <strong className="text-neutral-900 text-xl">10</strong> posts
    </div>
    <div>
      <Followers
        followers={user.followers.map((follower) => ({
          _id: follower._id,
          userName: follower.userName,
          profileImage: follower.profileImage,
        }))}
        currentUser={currentUser ?? { _id: '', userName: '' }}
      />
    </div>
    <div>
      <Followings
        followings={user.followings.map((following) => ({
          _id: following._id,
          userName: following.userName,
          profileImage: following.profileImage,
        }))}
        currentUser={currentUser ?? { _id: '', userName: '' }}
      />
    </div>
  </div>
);

export const ProfileBio = ({ user }: { user: User }) => (
  <div className="mt-4 space-y-1 text-sm leading-6">
    <div className="font-semibold">{user.fullName}</div>
    <div>{user.bio}</div>
  </div>
);

export const ProfileInfo = ({ user, currentUser, isFollowing }: { user: User; currentUser: any; isFollowing: boolean }) => (
  <div className="flex-1 min-w-0">
    <ProfileActions user={user} currentUser={currentUser} isFollowing={isFollowing} />
    <ProfileStats user={user} currentUser={currentUser} />
    <ProfileBio user={user} />
  </div>
);
