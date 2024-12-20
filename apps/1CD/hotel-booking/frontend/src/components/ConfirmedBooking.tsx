'use client';

import { Button } from '@/components/ui/button';
import { BookingStatus } from '@/generated';
import Image from 'next/image';

type Booking = {
  id: string | undefined | null;
  roomName: string | undefined | null;
  roomType: string | undefined | null;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: string | undefined | null;
  images: (string | null)[] | undefined | null;
};

const ConfirmedBooking = ({ booking }: { booking: Booking }) => {
  return (
    <div className="max-w-[986px] border rounded-md">
      <div className="flex">
        <div className="border-2 max-w-[395px] w-full">
          {booking.images && <Image src={booking?.images[0] || '/'} alt="image" width={400} height={200} className="object-cover w-full max-h-[220px]" />}
        </div>
        <div className="flex-1">
          <div className="px-5 py-5">
            <BookedStatus status={booking.status} />
            <div className="text-base font-bold">Flower Hotel Ulaanbaatar</div>
            <div className="text-sm font-normal text-[#71717A]">Standard Room, City View, 1 Queen Bed</div>
            <ul className="flex gap-2">
              <li>1 night</li>
              <li>1 adult</li>
              <li>1 room</li>
            </ul>
          </div>
          <div className="flex justify-between px-5 py-5">
            <div>
              <div>
                <p className="text-[#71717A]">Check in:</p> Monday
              </div>
              <div>
                <p className="Itinerary:">Itinerary:</p>
                <div>{String(booking?.checkInDate)}</div>
              </div>
            </div>
            <Button className="bg-white border text-black">View Detail</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmedBooking;

export const BookedStatus = ({ status }: { status: string | null | undefined }) => {
  if (status == BookingStatus.Booked) {
    return <div className={`bg-green-400 text-white text-[12px] rounded-full w-[62px] h-[20px] px-2.5 py-1 flex items-center justify-center `}>{status}</div>;
  }
  if (status == BookingStatus.Cancelled) {
    return <div className={`bg-red-600 text-white text-[12px] rounded-full w-[62px] h-[20px] px-2.5 py-1 flex items-center justify-center`}>{status}</div>;
  }
};
