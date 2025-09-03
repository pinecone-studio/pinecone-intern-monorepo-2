'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { demoImage } from '@/components/userProfile/mock-images';
import { FollowButton } from './FollowButton';
import Link from 'next/link';

export const Followings = ({
  followings,
  currentUser,
}: {
  followings: Array<{ _id: string; userName: string; profileImage?: string | null }>;
  currentUser: { _id: string; userName: string; followings: Array<{ _id: string }> };
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-left">
          <strong className="text-neutral-900 text-xl">{followings.length}</strong> Followings
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Followings</DialogTitle>
        </DialogHeader>

        {followings.length === 0 ? (
          <p className="text-neutral-500 text-sm">No followings yet</p>
        ) : (
          <ul>
            {followings.map((following, i) => {
              const isFollowing = currentUser.followings?.some((f: { _id: string }) => f._id === following._id);

              return (
                <Link href={`/${following.userName}`} key={i}>
                  <li className="flex items-center gap-3 py-2 justify-between">
                    <div className="flex items-center gap-3">
                      <Image src={following.profileImage || demoImage} alt={following.userName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                      <span className="font-medium">{following.userName}</span>
                    </div>

                    {currentUser._id !== following._id && (
                      <FollowButton targetUserId={following._id} initialIsFollowing={isFollowing} initialIsRequested={false} isPrivate={false} userName={following.userName} />
                    )}
                  </li>
                </Link>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
