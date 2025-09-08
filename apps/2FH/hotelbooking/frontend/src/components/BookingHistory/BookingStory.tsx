'use client';

import { BookedCard } from './_components/BookedCard';
import { useParams } from 'next/navigation';
import { useGetBookingsByUserIdQuery, useGetUserFirstnameByIdQuery } from '@/generated';
import { PreviousBooking } from './_components/PreviousBooking';
import { useOtpContext } from '../providers';
import { HotelLoader } from '../loadingComponent/Loader';
import { EmptyBookingHistory } from './_components/EmptyBookingHistory';

export const BookingHistory = () => {
  const { setBookingSuccess } = useOtpContext();
  setBookingSuccess(false);

  const { userid } = useParams();
  const { data: user } = useGetUserFirstnameByIdQuery({
    variables: { input: { _id: String(userid) } },
  });

  const { data: booking, loading } = useGetBookingsByUserIdQuery({
    skip: !userid,
    variables: { userId: String(userid) },
  });

  const hasUpcoming = (bookings: any[]) => bookings.some((b) => b.status === 'Booked');

  const hasNoBookings = (bookings: any[]) => bookings.length === 0 || !hasUpcoming(bookings);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <HotelLoader />
      </div>
    );
  }

  const bookings = booking?.getBookingsByUserId ?? [];


  

  return (
    <div className="w-[50%] flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-[24px]">Confirmed Booking</div>
          <div className="flex flex-col gap-3">
            {hasUpcoming(bookings) && bookings.filter((b) => b.status === 'Booked').map((e) => <BookedCard key={e.id} confirmedBooking={e} />)}
            {hasNoBookings(bookings) && <EmptyBookingHistory user={user} />}
          </div>
        </div>
        <PreviousBooking />
      </div>
    </div>
  );
};
