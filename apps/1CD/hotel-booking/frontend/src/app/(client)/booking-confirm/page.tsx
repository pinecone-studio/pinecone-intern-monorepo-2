'use client';
import { HotelReveiwRating } from '@/components/BookingDetailRightSide';
import { useGetBookingQuery } from '@/generated';
import { format } from 'date-fns';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  const { data, loading } = useGetBookingQuery({
    variables: {
      id: '6757dfb4687cb83ca69ff3cb',
    },
  });

  if (loading) return <div>loading...</div>;
  return (
    <div className="max-w-[640px] p-8 w-full mx-auto text-[#09090B] flex flex-col gap-6">
      <div className="flex justify-center">
        {data?.getBooking.roomId?.hotelId?.images && (
          <Image className="object-cover w-[166px] h-[166px]" src={data?.getBooking.roomId?.hotelId?.images[0] || '/'} alt="Frame" width={1000} height={1000} />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-2xl">You’re confirmed</div>
        <div className="flex justify-between">
          <div>Contact email</div>
          <div>samlee.mobbin@gmail.com</div>
        </div>
        <div>
          <Link href={'/'} className="bg-[#2563EB] text-white py-3 px-8 rounded-md">
            View your booking
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6 border rounded-sm">
        <div className="text-lg">{data?.getBooking.roomId?.hotelId?.hotelName}</div>
        <div className="text-[#71717A] text-sm">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</div>
        <div className="flex items-center gap-2">
          <div className="bg-[#2563EB] hover:bg-blue-300 active:bg-blue-400 w-[39px] h-[20px] flex justify-center items-center text-[#FAFAFA] rounded-full">
            {data?.getBooking.roomId?.hotelId?.userRating}
          </div>
          <HotelReveiwRating booking={data?.getBooking} />
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A]">Check in</div>
          <div className="flex gap-1">
            <div>{format(data?.getBooking?.checkInDate, 'EEEE, MMM d,')}</div>
            <div>{format(data?.getBooking?.checkInDate, 'h:mma')}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A]">Check out</div>
          <div className="flex gap-1">
            <div>{format(data?.getBooking?.checkOutDate, 'EEEE, MMM d,')}</div>
            <div>{format(data?.getBooking?.checkOutDate, 'h:mma')}</div>
          </div>
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div>{data?.getBooking.roomId?.roomInformation}</div>
        <div className="flex items-center gap-2">
          <Zap width={16} height={16} />
          <div>1 Queen Bed</div>
        </div>
        <div className="flex items-center gap-2">
          <Zap width={16} height={16} />
          <div>Breakfast included</div>
        </div>
        <div className="flex items-center gap-2">
          <Zap width={16} height={16} />
          <div>Sleeps 2</div>
        </div>
        <div className="flex items-center gap-2">
          <Zap width={16} height={16} />
          <div>Pet friendly</div>
        </div>
      </div>
    </div>
  );
};
export default Page;
