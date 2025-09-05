'use client';

import { PreviousBookingCard } from './PreviousBookingCard';
import { EmptySvg } from './assets/EmptySvg';
import { useGetBookingsByUserIdQuery } from '@/generated';
import { useParams } from 'next/navigation';

export const PreviousBooking = () => {
  const { userid } = useParams();

  const { data: booking } = useGetBookingsByUserIdQuery({
    skip: !userid,
    variables: { userId: String(userid) },
  });

  const withoutStatusBooking = booking?.getBookingsByUserId?.filter((item) => item.status) ?? [];

  if (withoutStatusBooking.length === 0 || withoutStatusBooking.every((e) => e.status === 'Booked')) {
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
        {withoutStatusBooking
          ?.filter((item) => item.status && ['cancelled', 'completed'].includes(item.status.toLowerCase()))
          .map((e) => (
            <PreviousBookingCard key={e.id} hotelId={e.hotelId} roomId={e.roomId} checkInDate={e.checkInDate} adults={e.adults ?? 0} status={`${e.status ?? ''}`} />
          ))}
      </div>
    </div>
  );
};
