import React from 'react';
import { ChevronLeft } from 'lucide-react';
import GeneralInfoCard from '@/components/room-detail/GeneralInfoCard';
import UpcomingBookings from '@/components/room-detail/UpcomingBookings';
import RoomServiceCard from '@/components/room-detail/RoomServiceCard';
import ImagesCard from '@/components/room-detail/ImagesCard';

const RoomDetail = () => {
  return (
    <>
      <section className="w-screen h-full pt-10 pb-10 bg-slate-50">
        <div className="flex items-center gap-2 ml-[13%]">
          <div className="w-8 h-8 text-center bg-white border rounded-lg">
            <ChevronLeft size={20} className="pt-1 pl-1" />
          </div>
          <h2 className="font-semibold">Economy Single Room</h2>
        </div>
        <section className="flex gap-5">
          <section className="ml-[13%] mt-5 flex flex-col gap-4">
            <GeneralInfoCard />
            <UpcomingBookings />
            <RoomServiceCard />
          </section>
          <ImagesCard />
        </section>
      </section>
    </>
  );
};

export default RoomDetail;
