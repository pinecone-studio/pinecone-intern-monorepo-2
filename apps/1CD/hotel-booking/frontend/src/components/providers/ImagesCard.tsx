'use client';
import { CardHeader } from '@/components/ui/card';

import Image from 'next/image';
import React from 'react';

import ImagesDialog from './ImagesDialog';
import { Room } from '@/generated';

const ImagesCard = ({ open, roomRefetch, setOpen, room }: { open: boolean; setOpen: (_value: boolean) => void; room: Room | undefined; roomRefetch: () => void }) => {
  return (
    <div className="xl:min-w-[340px] px-6 overflow-scroll mt-5 shadow-lg border-[1px] bg-white rounded-xl">
      <CardHeader className="flex flex-row justify-between px-0">
        <h3 className="font-semibold">Images</h3>
        <button className="text-blue-600" onClick={() => setOpen(true)} data-cy="Images-Dialog-Button">
          Edit
        </button>
      </CardHeader>
      {room?.images?.length ? (
        <div className="grid w-full grid-cols-2">
          {room?.images?.map((image, index) => (
            <Image key={index} className={`${index == 0 ? 'col-span-2  object-cover' : 'h-[200px]'} border rounded-md`} src={String(image)} height={1000} width={1000} alt="room photo" />
          ))}
        </div>
      ) : (
        <div className="text-center">not have any images</div>
      )}
      <ImagesDialog roomRefetch={roomRefetch} room={room} open={open} setOpen={setOpen} />
    </div>
  );
};

export default ImagesCard;
