'use client';

import { Button } from '@/components/ui/button';
import { ReturnBooking } from '@/generated';
import Image from 'next/image';
import { BookedStatus } from './ConfirmedBooking';

const PriviousBooking = ({ booking }: { booking: ReturnBooking }) => {
  return (
    <div className="max-w-[986px] border rounded-md">
      <div className="flex">
        <div className="max-w-[395px] w-full border-2">
          {booking.roomId?.hotelId?.images && <Image src={booking?.roomId.hotelId.images[0] || '/'} alt="image" width={500} height={500} className="object-cover w-full max-h-[220px]" />}
        </div>
        <div className="flex-1">
          <div className="px-5 py-5">
            <BookedStatus status={booking.status} />

            <div className="text-base font-bold">Flower Hotel Ulaanbaatar</div>
            <div className="text-sm font-normal text-[#71717A]">{booking.roomId?.roomType}</div>
            <ul className="flex gap-2">
              <li>1 night</li>
              <li>1 adult</li>
              <li>1 room</li>
            </ul>
          </div>
          <div className="flex justify-between px-5 py-5">
            <div>
              <div>{booking?.checkInDate}</div>
              <div>Itinerary: {booking._id}</div>
            </div>
            <Button className="bg-white border text-black"> View Detail</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PriviousBooking;
