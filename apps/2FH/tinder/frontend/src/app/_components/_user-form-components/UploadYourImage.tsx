import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonNextPrevious } from '../ButtonNextPrevious';
import { Button } from '@/components/ui/button';

import { Props } from '@/app/global';

export const UploadYourImage = ({ nextPage, previousPage }: Props) => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="text-center">
        <h1 className="font-semibold text-3xl">Upload your image</h1>
        <h2 className="text-[#71717A]">Please choose an image that represents you.</h2>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-6 overflow-visible m">
        <Skeleton className="w-[180px] h-[270px]" />
        <Skeleton className="w-[180px] h-[270px]" />
        <Skeleton className="w-[180px] h-[270px]" />
        <Skeleton className="w-[180px] h-[270px]" />
        <Skeleton className="w-[180px] h-[270px]" />
        <Skeleton className="w-[180px] h-[270px]" />
      </div>

      <Button className="group text-black border border-[#E11D48E5] bg-white rounded-full w-full hover:bg-[#E11D48E5] hover:text-white">
        <span className="text-[#E11D48E5] text-[16px] mr-4 group-hover:invisible">+</span>Upload image
      </Button>

      <div className="flex justify-between items-center">
        <ButtonNextPrevious previousPage={previousPage} />
        <ButtonNextPrevious nextPage={nextPage} />
      </div>
    </div>
  );
};
