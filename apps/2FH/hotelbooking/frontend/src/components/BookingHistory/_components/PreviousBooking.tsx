'use client';

import { Booking } from '@/generated';
import { EmptySvg } from './assets/EmptySvg';
import { BookedCard } from './BookedCard';
import { PreviousBookingCard } from './PreviousBookingCard';

type Props = {
  data: Booking[];
};
export const PreviousBooking = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-[24px]">Previous Booking</div>
      <div className="flex flex-col gap-3 ">
        {data
          .filter((e) => ['CANCELLED', 'COMPLETED'].includes(e.status))
          .map((e) => (
            <PreviousBookingCard data={e} />
          ))}
      </div>
    </div>
  );
};
