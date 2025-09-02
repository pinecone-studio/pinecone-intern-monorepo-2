'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { demoImage } from '@/components/userProfile/mock-images';
import { FollowButton } from './FollowButton';

export const Followings = ({ followings, currentUser }: { followings: Array<{ _id: string; userName: string; profileImage?: string | null }>; currentUser: { _id: string; userName: string } }) => {
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
          <ul className="divide-y divide-neutral-200">
            {followings.map((following, i) => (
              <li key={i} className="flex items-center gap-3 py-2">
                <Image src={following.profileImage || demoImage} alt={following.userName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                <span className="font-medium">{following.userName}</span>
                {currentUser._id === following._id && (
                  <FollowButton targetUserId={following._id} initialIsFollowing={true} initialIsRequested={false} isPrivate={false} userName={following.userName} />
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
