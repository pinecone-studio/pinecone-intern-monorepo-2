import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const MainPageStory = ({ user }: { user: { _id: string; userName: string; profileImg?: string | null } }) => {
  return (
    <Link href={`/story/${user?._id}`}>
      <div className="flex flex-col gap-2 mt-6 w-fit">
        <div className="rounded-full w-fit bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
          <div className="rounded-full bg-white w-[70px] h-[70px] flex items-center justify-center">
            <Avatar className="w-[64px] h-[64px]">
              <AvatarImage data-testid="avatar-image" src={user.profileImg || '/images/profileImg.webp'} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <span className="text-xs text-[#09090B] text-center">{user.userName}</span>
      </div>
    </Link>
  );
};

export default MainPageStory;
