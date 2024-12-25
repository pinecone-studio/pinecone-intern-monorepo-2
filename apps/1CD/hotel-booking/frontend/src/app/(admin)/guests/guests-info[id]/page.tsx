'use client';
import React from 'react';
import BreadCrumb from '../_components/BreadCrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';

import GuestCard from '../_components/GuestCard';
import RoomInfo from '../_components/RoomCard';
import { ChevronLeft } from 'lucide-react';
import { useGetBookingQuery } from '@/generated';

const GuestInfo = ({ params }: { params: { id: string } }) => {
  const { data, loading } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });

  if (loading) return <div>loading...</div>;
  console.log('dta', data?.getBooking);
  return (
    <>
      <main className="w-screen h-screen bg-slate-50" data-cy="Guest-Info-Page">
        <div className="flex items-center gap-2 my-6 ml-5">
          <SidebarTrigger />
          <BreadCrumb />
        </div>
        <section className="flex flex-col gap-3 item-center">
          <div className="flex items-center gap-2 ml-[22%]">
            <div className="w-8 h-8 text-center bg-white border rounded-lg">
              <ChevronLeft size={20} className="pt-1 pl-1" />
            </div>
            <h2 className="font-semibold">Shagai Nymdorj</h2>
          </div>
          <section className="flex justify-center gap-4" data-cy="Guests-Info-Content-Section">
            <GuestCard info={data?.getBooking} />
            <RoomInfo />
          </section>
        </section>
      </main>
    </>
  );
};

export default GuestInfo;
