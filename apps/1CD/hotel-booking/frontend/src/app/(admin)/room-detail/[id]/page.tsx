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
    <>
      <section className="w-screen h-full pt-10 pb-10 bg-slate-50" data-cy="Room-Detail-Page">
        <div className="flex items-center gap-2 ml-[13%]">
          <div className="w-8 h-8 text-center bg-white border rounded-lg">
            <ChevronLeft size={20} className="pt-1 pl-1" />
          </div>
          <h2 className="font-semibold">{data?.getRoom.roomName}</h2>
        </div>
        <section className="flex gap-5">
          <div className="ml-[13%] mt-5 flex flex-col gap-4">
            <GeneralInfoCard openGen={openGen} setOpenGen={setOpenGen} />
            <UpcomingBookings />
            <RoomServiceCard open={openService} setOpen={setOpenService} />
          </div>
          <ImagesCard open={open} setOpen={setOpen} />
        </section>
      </section>
    </>
  );
};

export default RoomDetail;
