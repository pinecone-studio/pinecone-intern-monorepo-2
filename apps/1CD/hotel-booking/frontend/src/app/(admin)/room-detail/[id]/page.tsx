'use client';
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import GeneralInfoCard from '@/app/(admin)/room-detail/[id]/_components/GeneralInfoCard';
import UpcomingBookings from '@/app/(admin)/room-detail/[id]/_components/UpcomingBookings';
import RoomServiceCard from '@/app/(admin)/room-detail/[id]/_components/RoomServiceCard';

import { useGetRoomQuery } from '@/generated';
import ImagesCard from './_components/ImagesCard';

const RoomDetail = ({ params }: { params: { id: string } }) => {
  const { data } = useGetRoomQuery({
    variables: {
      id: params.id,
    },
  });

  const [openGen, setOpenGen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-full pt-10 pb-10 bg-slate-50">
      <section className="ml-4" data-cy="Room-Detail-Page">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-white border rounded-lg">
            <ChevronLeft size={20} />
          </div>
          <h2 className="font-semibold">{data?.getRoom.roomName}</h2>
        </div>
        <section className="flex gap-5">
          <div className="flex flex-col gap-4 mt-5">
            <GeneralInfoCard openGen={openGen} setOpenGen={setOpenGen} roomData={data?.getRoom} />
            <UpcomingBookings />
            <RoomServiceCard open={openService} setOpen={setOpenService} room={data?.getRoom} />
          </div>
          <ImagesCard open={open} setOpen={setOpen} />
        </section>
      </section>
    </div>
  );
};

export default RoomDetail;
