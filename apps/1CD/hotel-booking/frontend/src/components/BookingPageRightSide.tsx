import { ReturnBooking } from '@/generated';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import { HotelReveiwRating } from './BookingDetailRightSide';
import { format } from 'date-fns';

export const BookingPageRightSide = ({ booking }: { booking: ReturnBooking | undefined | null }) => {
  return (
    <div data-testid="Booking-Right-Side" className="max-w-[515px] w-full">
      <div className="w-full h-auto">
        {booking?.roomId?.images && <Image src={`${booking?.roomId?.images[0]}`} className="object-cover w-full h-full rounded-t-[8px] bg-slate-500" width={1000} height={1000} alt="image" />}
      </div>

      <div className="p-4 text-[#09090B] border rounded-b-[8px] mb-6">
        <div className="mb-1 text-lg font-bold">{booking?.roomId?.hotelId?.hotelName}</div>
        <div className="text-sm mb-4 text-[#71717A]">{booking?.roomId?.hotelId?.location}</div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-[#2563EB] w-[39px] h-[20px] text-center text-[#FAFAFA] rounded-full">{booking?.roomId?.hotelId?.userRating}</div>
          <HotelReveiwRating booking={booking} />
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="text-[#71717A]">Check in</div>
          {booking?.checkInDate && (
            <div className="flex items-center gap-2">
              <div>{format(booking?.checkInDate, 'EEEE, MMM d,')}</div>
              <div>{format(booking?.checkInDate, 'h:mma')}</div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="text-[#71717A]">Check out</div>
          {booking?.checkOutDate && (
            <div className="flex items-center gap-2">
              <div>{format(booking?.checkOutDate, 'EEEE, MMM d,')}</div>
              <div>{format(booking?.checkOutDate, 'h:mma')}</div>
            </div>
          )}
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="mb-4 text-sm">{booking?.roomId?.roomName}</div>
        <div className="grid grid-cols-2 gap-x-[56px] gap-y-2">
          {booking?.roomId?.amenities?.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>{amenity}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col rounded-[8px] gap-2 border p-4 text-[#09090B]">
        <div className="text-lg font-bold">Price Detail</div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <div>1 room x 1 night</div>
            <div className="text-[#71717A]">{booking?.roomId?.price} ₮ per night</div>
          </div>
          <div className="">{booking?.roomId?.price} ₮</div>
        </div>
        <div className="py-4 h-[1px] w-full"></div>
        <div className="flex justify-between">
          <div className="text-sm">Total price</div>
          <div className="text-lg font-bold">USD 81.00</div>
        </div>
      </div>
    </div>
  );
};
