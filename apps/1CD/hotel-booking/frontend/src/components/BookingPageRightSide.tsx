import { Room } from '@/generated';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import { HotelReveiwRating } from './BookingDetailRightSide';
import { format } from 'date-fns';
import { useQueryState } from 'nuqs';
import DisplayTugrug from './DisplayTugrug';

export const BookingPageRightSide = ({ room }: { room: Room | undefined }) => {
  const [dateFrom] = useQueryState('dateFrom');
  const [dateTo] = useQueryState('dateTo');
  return (
    <div data-testid="Booking-Right-Side" className="w-full md:grid md:grid-cols-2 md:gap-5 lg:block">
      <div className="w-full h-auto ">
      <div className='pb-4 font-bold text-gray-900 md:pt-14 lg:pt-0'>Selected Accommodation Details</div>
        {room?.images?.[0] && <Image src={`${room?.images[0]}`} className="object-cover rounded-t-lg md:rounded-lg  w-full h-full lg:rounded-t-[8px] lg:rounded-b-none bg-slate-500" width={1000} height={1000} alt="image" />}
      </div>

      <div className="p-4 text-[#09090B] border rounded-b-[8px]  md:rounded-lg lg:rounded-b-lg lg:rounded-t-none">
        <div className="mb-1 text-lg font-bold text-gray-600">{room?.hotelId?.hotelName}</div>
        <div className="text-sm mb-4 text-[#71717A]">{room?.hotelId?.location}</div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-[#2563EB] w-[39px] h-[20px] text-center text-[#FAFAFA] rounded-full">{room?.hotelId?.userRating}</div>
          <HotelReveiwRating userRating={room?.hotelId?.userRating} />
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="text-[#71717A]">Check in</div>
          {dateFrom && (
            <div className="flex items-center gap-2">
              <div>{format(dateFrom, 'EEEE, MMM d,')}</div>
              <div>{format(dateFrom, 'h:mma')}</div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="text-[#71717A]">Check out</div>
          {dateTo && (
            <div className="flex items-center gap-2">
              <div>{format(dateTo, 'EEEE, MMM d,')}</div>
              <div>{format(dateTo, 'h:mma')}</div>
            </div>
          )}
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="mb-4 text-sm">{room?.roomName}</div>
        <div className="grid grid-cols-2 gap-x-[56px] gap-y-2">
          {room?.amenities?.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>{amenity}</div>
            </div>
          ))}
        </div>
      </div>
      <div></div>
      <div className="flex flex-col rounded-lg gap-2 border p-4 text-[#09090B] mt-5 md:mt-0 lg:mt-5">
        <div className="text-lg font-bold text-gray-600">Price Detail</div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col gap-1">
            <div>1 room x 1 night</div>
            <div className="text-[#71717A]">{room?.price} ₮ per night</div>
          </div>
          <DisplayTugrug tugrug={Number(room?.price)} />
        </div>
        <div className="py-4 h-[1px] w-full"></div>
        {room?.price && (
          <div className="flex justify-between">
            <div className="text-sm">Total price</div>
            <div className="text-lg font-bold">{room.price + 50000}</div>
          </div>
        )}
      </div>
    </div>
  );
};
