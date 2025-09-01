'use client';
import { BookingPayment } from '@/components/payment/_components/BookingPayment';
import { RoomInformation } from '@/components/payment/_components/RoomInformation';
import { useState } from 'react';
import { ConfirmedBooking } from '@/components/payment/_components/ConfirmedBooking/ConfirmedBooking';

export type Data = {
  userId: string;
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
};

const Booking = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<Data | undefined | null>(undefined);

  return (
    <>
      {confirmed ? (
        <ConfirmedBooking bookingData={bookingData} />
      ) : (
        <div className="flex gap-16 justify-between w-[1280px] px-7 py-5">
          <BookingPayment setConfirmed={setConfirmed} setBookingData={setBookingData} />
          <RoomInformation />
        </div>
      )}
    </>
  );
};

export default Booking;
