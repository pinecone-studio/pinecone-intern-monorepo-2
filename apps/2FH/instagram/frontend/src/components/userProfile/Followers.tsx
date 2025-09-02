'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { demoImage } from '@/components/userProfile/mock-images';
import { FollowButton } from './FollowButton';

export const Followers = ({
  followers,
  currentUser,
}: {
  followers: Array<{ _id: string; userName: string; profileImage?: string | null }>;
  currentUser: { _id: string; userName: string; followings?: Array<{ _id: string }> };
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-left">
          <strong className="text-neutral-900 text-xl">{followers.length}</strong> Followers
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>

        {followers.length === 0 ? (
          <p className="text-neutral-500 text-sm">No followers yet</p>
        ) : (
          <ul>
            {followers.map((follower, i) => {
              // 🔑 currentUser тухайн follower-ийг дагаж байгаа эсэхийг шалгах
              const isFollowing = currentUser?.followings?.some((f) => f._id === follower._id);

              return (
                <li key={i} className="flex items-center gap-3 py-2 justify-between ">
                  <div className="flex items-center gap-3">
                    <Image src={follower.profileImage || demoImage} alt={follower.userName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                    <span className="font-medium">{follower.userName}</span>
                  </div>

                  {currentUser._id !== follower._id && (
                    <FollowButton targetUserId={follower._id} initialIsFollowing={!!isFollowing} initialIsRequested={false} isPrivate={false} userName={follower.userName} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
