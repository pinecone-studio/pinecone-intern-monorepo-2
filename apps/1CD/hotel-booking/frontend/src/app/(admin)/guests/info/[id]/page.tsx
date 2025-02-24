'use client';
import React, { useState } from 'react';
import BreadCrumb from '../../_components/BreadCrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';

import GuestCard from '../../_components/GuestCard';
import RoomInfo from '../../_components/RoomCard';
import { ChevronLeft } from 'lucide-react';
import { useGetBookingQuery } from '@/generated';
import ConfirmCheckoutDialog from '../../_components/ConfirmCheckoutDialog';

const GuestInfo = ({ params }: { params: { id: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });

  return (
    <>
      <div className="min-h-screen pt-5 bg-slate-50" data-cy="Guest-Info-Page">
        <div className="ml-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <BreadCrumb
              items={[
                { link: '/add-hotel/home-page', Name: 'Hotels' },
                { link: `/admin-hotel-detail/${data?.getBooking.hotelId}`, Name: 'Hotel Detail' },
                { link: `/room-detail/${data?.getBooking.roomId?.id}`, Name: 'Room Detail' },
                { link: `/guests/info/${data?.getBooking._id}`, Name: 'Guest Info' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3 mt-8 item-center">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">
                {data?.getBooking.firstName} {data?.getBooking.lastName}
              </h2>
            </div>
            <div className="flex gap-4" data-cy="Guests-Info-Content-Section">
              <GuestCard setOpen={setIsOpen} info={data?.getBooking} />
              <RoomInfo data={data?.getBooking} />
            </div>
          </div>
        </div>
        <ConfirmCheckoutDialog refetch={refetch} id={params.id} open={isOpen} setOpen={setIsOpen} />
      </div>
    </>
  );
};

export default GuestInfo;
