'use client';

import { useParams } from 'next/navigation';
import { Booking } from '@/generated';
import { PreviousBookingCard } from './PreviousBookingCard';
import { EmptySvg } from './assets/EmptySvg';

type Props = {
  data?: Booking[];
};

export const PreviousBooking = ({ data }: Props) => {
  const { userid } = useParams();

  const withoutStatusBooking = data?.filter((item) => item.status) ?? [];

  if (withoutStatusBooking.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-[24px]">Previous Booking</div>
        <div className="flex flex-col gap-3 ">
          <div className="flex flex-col gap-3 items-center justify-center">
            <EmptySvg />

            <div>No previous booking</div>
            <div className="opacity-50">Your past stays will appear here once completed.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[24px]">Previous Booking</div>
      <div className="flex flex-col gap-3 ">
        {data?.map((e) => (
          <PreviousBookingCard key={e.id} hotelId={e.hotelId} roomId={e.roomId} checkInDate={e.checkInDate} childrens={e.children ?? 0} adults={e.adults ?? 0} />
        ))}
      </div>
    </div>
  );
};
