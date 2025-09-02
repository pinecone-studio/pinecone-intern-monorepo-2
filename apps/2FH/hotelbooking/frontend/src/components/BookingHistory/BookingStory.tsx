'use client';

import { BookedCard } from './_components/BookedCard';
import { useParams } from 'next/navigation';
import { useGetBookingsByUserIdQuery } from '@/generated';
import { PreviousBooking } from './_components/PreviousBooking';
import { EmptySvg } from './_components/assets/EmptySvg';

export const BookingHistory = () => {
  const { userid } = useParams();
  const { data } = useGetBookingsByUserIdQuery({
    skip: !userid,
    variables: {
      userId: String(userid),
    },
  });

  return (
    <div className="w-2/5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-[24px]">Confirmed Booking</div>
        <div className="flex flex-col gap-3 ">
          {data?.getBookingsByUserId.map((e) => {
            return <BookedCard key={e.id} confirmedBooking={e} />;
          })}
        </div>
      </div>

      <PreviousBooking data={data?.getBookingsByUserId ?? []} />
    </div>
  );
};
