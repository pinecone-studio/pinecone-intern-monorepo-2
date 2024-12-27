'use client';

import BookingDetailLeftSide from '@/components/BookingDetailLeftSide';
import BookingDetailRightSide from '@/components/BookingDetailRightSide';
import { useGetBookingQuery } from '@/generated';
import { ChevronLeft } from 'lucide-react';

const Page = () => {
  const { data, loading } = useGetBookingQuery({
    variables: {
      id: '6757dfb4687cb83ca69ff3cb',
    },
  });
  if (loading) return <div className="min-h-screen text-3xl font-bold text-center">loading...</div>;
  return (
    <div data-cy="Booking-Detail-Home-Page" className="max-w-[1280px] mx-auto w-full p-8">
      <div className="flex w-8 h-8 bg-[#FFFFFF] p-2 mb-6 border rounded-md items-center justify-center hover:cursor-pointer active:bg-slate-50">
        <ChevronLeft width={16} height={16} />
      </div>
      <div className="flex gap-6">
        <BookingDetailLeftSide booking={data?.getBooking} />
        <BookingDetailRightSide booking={data?.getBooking} />
      </div>
    </div>
  );
};
export default Page;
