'use client';

import { Plus } from 'lucide-react';
 
const UploadImage = () => {
  return (
    <div>
      <div className="mb-[24px]">
        <p className="text-xl font-semibold">Your Images</p>
        <p className="text-sm text-gray-400 mt-2">Please choose an image that represents you.</p>
      </div>
      <div className="grid grid-cols-3 gap-[22px] mt-4 border-t-[1px] border-gray-800 pt-6">
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <div className="bg-red-300 w-[190px] h-[280px]"></div>
        <button className="col-span-3 border-y-[1px] border-x-[0.5px] border-red-400 rounded-full py-2 flex justify-center items-center gap-2">
          <Plus className="text-red-400" />
          Upload image
        </button>
      </div>
    </div>
  );
};
 
export default UploadImage;