'use client';
import { CardHeader } from '@/components/ui/card';
import { CardContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import ImagesDialog from './ImagesDialog';
import { DialogType } from './RoomServiceDialog';

const ImagesCard = ({ open, setOpen }: DialogType) => {
  return (
    <div className="xl:min-w-[340px] h-[600px] mt-5 shadow-lg border-[1px] bg-white rounded-xl">
      <CardHeader className="flex flex-row justify-between">
        <h3 className="font-semibold">Images</h3>
        <button className="text-blue-600" onClick={() => setOpen(true)} data-cy="Images-Dialog-Button">
          Edit
        </button>
      </CardHeader>
      <div data-cy={`Images-Dialog`}>
        <ImagesDialog open={open} setOpen={setOpen} />
      </div>

      <CardContent>
        <div className="border h-52 rounded-xl">
          <Image src="/" height={100} width={100} alt="room photo" />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-1 pt-1 border">
          <div className="w-40 h-32 border"></div>
          <div className="w-40 h-32 border"></div>
          <div className="w-40 h-32 border"></div>
        </div>
      </CardContent>
    </div>
  );
};

export default ImagesCard;
