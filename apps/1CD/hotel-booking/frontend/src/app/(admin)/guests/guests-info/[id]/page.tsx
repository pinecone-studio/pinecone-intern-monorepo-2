'use client';
import React from 'react';
import BreadCrumb from '../../_components/BreadCrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';

import GuestCard from '../../_components/GuestCard';
import RoomInfo from '../../_components/RoomCard';
import { ChevronLeft } from 'lucide-react';
import { useGetBookingQuery } from '@/generated';
import { useRouter } from 'next/navigation';

const GuestInfo = ({ params }: { params: { id: string } }) => {
  const { data } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });
  const router = useRouter();
  return (
    <>
      <div data-cy="Guest-Info-Router" onClick={() => router.push(`/guests/guests-info/${params.id}`)}>
        <div className="w-screen h-screen bg-slate-50" data-cy="Guest-Info-Page">
          <div className="flex items-center gap-2 my-6 ml-5">
            <SidebarTrigger />
            <BreadCrumb />
          </div>
          <div className="flex flex-col gap-3 item-center">
            <div className="flex items-center gap-2 ml-[25%]">
              <div className="w-8 h-8 text-center bg-white border rounded-lg">
                <ChevronLeft size={20} className="pt-1 pl-1" />
              </div>
              <h2 className="font-semibold">Shagai Nymdorj</h2>
            </div>
            <div className="flex justify-center gap-4" data-cy="Guests-Info-Content-Section">
              <GuestCard info={data?.getBooking} />
              <RoomInfo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestInfo;
