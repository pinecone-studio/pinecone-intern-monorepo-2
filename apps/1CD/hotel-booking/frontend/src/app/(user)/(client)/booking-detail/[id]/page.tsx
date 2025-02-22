'use client';
import BookingDetailLeftSide from '@/components/BookingDetailLeftSide';
import BookingDetailRightSide from '@/components/BookingDetailRightSide';
import CheckLoginUser from '@/components/providers/CheckLoginUser';
import { useGetBookingQuery } from '@/generated';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { data, loading } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });
  if (loading) return <div className="min-h-screen text-3xl font-bold text-center">loading...</div>;
  return (
    <CheckLoginUser>
      <div data-cy="Booking-Detail-Home-Page" className="max-w-[1280px] mx-auto w-full p-8">
        <div className="flex w-8 h-8 bg-[#FFFFFF] p-2 mb-6 border rounded-md items-center justify-center hover:cursor-pointer active:bg-slate-50">
          <ChevronLeft width={16} height={16} onClick={() => router.push('/booking')} />
        </div>
        <div className="flex gap-6 flex-col-reverse md:flex-row">
          <BookingDetailLeftSide booking={data?.getBooking} />
          <BookingDetailRightSide booking={data?.getBooking} />
        </div>
      </div>
    </CheckLoginUser>
  );
};
export default Page;
