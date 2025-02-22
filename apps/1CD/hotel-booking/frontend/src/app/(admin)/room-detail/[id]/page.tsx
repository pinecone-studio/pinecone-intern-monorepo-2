'use client';
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { useGetBookingsQuery, useGetRoomQuery } from '@/generated';

import UpcomingBookings from '@/components/providers/UpcomingBookings';

import BreadCrumb from '../../guests/_components/BreadCrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import GeneralInfoCard from '@/components/providers/GeneralInfoCard';
import RoomServiceCard from '@/components/providers/RoomServiceCard';
import ImagesCard from '@/components/providers/ImagesCard';

const RoomDetail = ({ params }: { params: { id: string } }) => {
  const { data, refetch } = useGetRoomQuery({
    variables: {
      id: params.id,
    },
  });

  const { data: Bookings } = useGetBookingsQuery({
    variables: {
      hotelId: data?.getRoom?.hotelId?._id,
    },
  });
  const [openGen, setOpenGen] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full pt-10 pb-10 bg-slate-50">
      <div className="flex items-center gap-2 mb-4 ml-4">
        <SidebarTrigger />
        <BreadCrumb
          items={[
            { link: '/add-hotel/home-page', Name: 'Hotels' },
            { link: `/admin-hotel-detail/${data?.getRoom.hotelId?._id}`, Name: 'Hotel Detail' },
            { link: `/room-detail/${data?.getRoom.id}`, Name: 'Room Detail' },
          ]}
        />
      </div>
      <section className="ml-4" data-cy="Room-Detail-Page">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{data?.getRoom.roomName}</h2>
        </div>
        <section className="flex gap-5">
          <div className="flex flex-col gap-4 mt-5">
            <GeneralInfoCard openGen={openGen} setOpenGen={setOpenGen} roomData={data?.getRoom} />
            <UpcomingBookings bookings={Bookings?.getBookings} />
            <RoomServiceCard refetch={refetch} open={openService} setOpen={setOpenService} room={data?.getRoom} />
          </div>
          <ImagesCard roomRefetch={refetch} room={data?.getRoom} open={open} setOpen={setOpen} />
        </section>
      </section>
    </div>
  );
};

export default RoomDetail;
