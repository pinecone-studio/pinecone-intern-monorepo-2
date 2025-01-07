import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StoryCard = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/images/img1.avif')",
        }}
        className="h-[435px] w-[245px] flex flex-col items-center justify-center gap-2 bg-no-repeat bg-cover bg-center rounded-md"
      >
        {/* <div className="rounded-full bg-[linear-gradient(to_top_right,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285aeb_90%)] p-[3px]"> */}
        <div className="rounded-full bg-[linear-gradient(to_top_right,#f9ce34_10%,#ee2a7b_60%)] p-[3px]">
          <div className="rounded-full bg-white w-[60px] h-[60px] flex items-center justify-center">
            <Avatar className="w-[56px] h-[56px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex flex-col items-center text-white">
          <span>username</span>
          <span className="-mt-1">5h</span>
        </div>
      </div>
    </>
  );
};

export default StoryCard;
