'use client';
import BookingCard from '@/app/(user)/(client)/_components/BookingCard';
import { useAuth } from '@/components/providers';
import CheckLoginUser from '@/components/providers/CheckLoginUser';
import { Button } from '@/components/ui/button';
import { BookingStatus, ReturnBooking, useGetBookingFindByUserIdQuery } from '@/generated';
import { ClockArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading } = useGetBookingFindByUserIdQuery({
    variables: {
      userId: user?._id,
    },
  });

  if (loading)
    return (
      <div className="flex justify-center">
        <Image src={'/loader.svg'} alt="loader" width={200} height={200} className="w-[200px] h-[200px]" />
      </div>
    );
  const confirmed: ReturnBooking[] = [];
  const previous: ReturnBooking[] = [];
  data?.getBookingFindByUserId.forEach((booking) => booking.status == BookingStatus.Booked && confirmed.push(booking));
  data?.getBookingFindByUserId.forEach((booking) => booking.status == BookingStatus.Cancelled && previous.push(booking));
  data?.getBookingFindByUserId.forEach((booking) => booking.status == BookingStatus.Completed && previous.push(booking));

  return (
    <CheckLoginUser>
      <div className="container mx-auto max-w-[960px] flex flex-col" data-cy="Confirmed-Booking">
        <div className="p-4 text-2xl font-semibold">Confirmed Booking</div>
        {confirmed.length ? (
          <div className="flex flex-col gap-3" data-cy="Booking-Card-Status">
            {confirmed.map((booking) => (
              <div className="px-6 sm:px-0" key={booking._id}>
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div data-cy="booking-div" className="p-4 text-2xl font-semibold">
              Booking
            </div>
            <div className="max-w-[896px] flex flex-col items-center gap-4">
              <div className="w-[123.22px] h-[131.45px]">
                <Image src="/images/Frame.png" alt="image" width={140} height={140} />
              </div>
              <div>
                <p>Shagai, you have no upcoming trips.</p>
                <p>Where are you going next?</p>
              </div>
              <Button data-cy="start-exploring-button" onClick={() => router.push('/')} className="bg-[#2563EB] text-sm font-medium text-[#FAFAFA]">
                Start Exploring
              </Button>
            </div>
          </div>
        )}
        <div className="p-4 text-2xl font-semibold">Previous Booking</div>
        {previous.length ? (
          <div className="flex flex-col gap-3">
            {previous.map((booking) => (
              <div key={booking._id}>
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-[896px] w-full flex flex-col items-center gap-1 pb-8">
            <ClockArrowUp className="text-slate-400" />
            <div className="text-sm font-medium">No Previous Bookings</div>
            <div className="text-sm font-normal text-[#71717A]">Your past stays will appear here once completed.</div>
          </div>
        )}
      </div>
    </CheckLoginUser>
  );
};
export default Page;
