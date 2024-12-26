'use client';

import { Button } from '@/components/ui/button';
import { BookingStatus, ReturnBooking } from '@/generated';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const BookingCard = ({ booking }: { booking: ReturnBooking }) => {
  const router = useRouter();
  return (
    <div className="max-w-[986px] border rounded-md">
      <div className="flex">
        <div className="border-2 max-w-[395px] w-full">
          {booking.roomId?.hotelId?.images && <Image src={booking.roomId?.hotelId?.images[0] || '/'} alt="image" width={1000} height={1000} className="object-cover w-full h-full" />}
        </div>
        <div className="flex-1 gap-2">
          <div className="px-5 py-5 gap-2">
            <div>
              <BookedStatus status={booking.status} />
            </div>
            <div className="text-base font-bold py-2">{booking.roomId?.hotelId?.hotelName}</div>
            <div className="text-sm font-normal text-[#71717A]">{booking.roomId?.roomType}</div>
            <ul className="flex gap-2 py-3">
              <li>1 night</li>
              <li>1 adult</li>
              <li>1 room</li>
            </ul>
          </div>
          <div className="flex justify-between px-5 py-5 items-center">
            <div>
              <div className="flex gap-2">
                <div className="text-[#71717A] font-normal">Check in:</div>
                <div>{format(String(booking?.checkInDate), 'EEEE, MMM d')}</div>
                <div>{format(String(booking?.checkInDate), 'h:mma')}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[#71717A] font-normal">Itinerary:</div>
                <div>{booking?._id}</div>
              </div>
            </div>
            <Button data-cy="view-button" onClick={() => router.push(`booking-detail/${booking._id}`)} className="bg-white border text-black p-2 rounded-md">
              View Detail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingCard;

export const BookedStatus = ({ status }: { status: string | null | undefined }) => {
  if (status == BookingStatus.Booked) {
    return <div className={`bg-[#18BA51] text-white text-[12px] rounded-full w-[62px] h-[20px] px-2.5 py-1 flex items-center justify-center `}>{status}</div>;
  }
  if (status == BookingStatus.Cancelled) {
    return <div className={`bg-[#E11D48] text-white text-[12px] rounded-full w-[62px] h-[20px] px-2.5 py-1 flex items-center justify-center`}>{status}</div>;
  }
};
