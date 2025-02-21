'use client';
import { HotelReveiwRating } from '@/components/BookingDetailRightSide';
import CheckLoginUser from '@/components/providers/CheckLoginUser';
import { useGetBookingQuery } from '@/generated';
import { format } from 'date-fns';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Page = ({ params }: { params: { id: string } }) => {
  const { data, loading } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });
  const CheckIndate = () => {
    if (!data?.getBooking.checkInDate) return null;
    return (
      <div className="flex gap-1">
        <div>{format(data?.getBooking?.checkOutDate, 'EEEE, MMM d,')}</div>
        <div>{format(data?.getBooking?.checkInDate, 'h:mma')}</div>
      </div>
    );
  };
  const CheckOutDate = () => {
    if (!data?.getBooking.checkOutDate) return null;
    return (
      <div className="flex gap-1">
        <div>{format(data?.getBooking?.checkOutDate, 'EEEE, MMM d,')}</div>
        <div>{format(data?.getBooking?.checkOutDate, 'h:mma')}</div>
      </div>
    );
  };
  if (loading) return <div className='flex justify-center'><Image src={'/loader.svg'} alt="loader" width={200} height={200} className="w-[200px] h-[200px]"/></div>

  return (
    <CheckLoginUser>
      <div data-cy="Booking-Confirm-Page" className="max-w-[640px] p-8 w-full mx-auto text-[#09090B] flex flex-col gap-6">
        <div className="flex justify-center">
          <Image className="object-cover w-[166px] h-[166px]" src={'/images/Frame.png'} alt="Frame" width={1000} height={1000} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-2xl">You’re confirmed</div>
          <div className="flex justify-between">
            <div>Contact email</div>
            <div>samlee.mobbin@gmail.com</div>
          </div>
          <div>
            <Link href={'/booking'} className="bg-[#2563EB] text-white py-3 px-8 rounded-md">
              View your booking
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-6 border rounded-sm">
          <div className="text-lg">{data?.getBooking.roomId?.hotelId?.hotelName}</div>
          <div className="text-[#71717A] text-sm">{data?.getBooking?.roomId?.hotelId?.location}</div>
          <div className="flex items-center gap-2">
            <div className="bg-[#2563EB] hover:bg-blue-300 active:bg-blue-400 w-[39px] h-[20px] flex justify-center items-center text-[#FAFAFA] rounded-full">
              {data?.getBooking.roomId?.hotelId?.userRating}
            </div>
            <HotelReveiwRating userRating={data?.getBooking.roomId?.hotelId?.userRating} />
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div className="flex flex-col gap-1">
            <div className="text-[#71717A]">Check in</div>
            <div className="flex gap-1">
              <CheckIndate />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#71717A]">Check out</div>
            <CheckOutDate />
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div>{data?.getBooking.roomId?.roomName}</div>

          <div className="flex flex-col gap-2" data-cy="Room-Amenities">
            {data?.getBooking.roomId?.roomInformation?.length ? (
              data.getBooking.roomId.roomInformation.map((amenity, index) => (
                <div data-cy={`Room-Amenities${index}`} key={amenity} className="flex items-center gap-2">
                  <Zap width={16} height={16} />
                  <div>{amenity}</div>
                </div>
              ))
            ) : (
              <div data-cy="No-Amenities">No amenities available</div>
            )}
          </div>
        </div>
      </div>
    </CheckLoginUser>
  );
};
export default Page;
