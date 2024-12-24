'use client';

import { ReturnBooking } from '@/generated';
import BookingDetailLeftSideBottom from './BookingDetailLeftSideBottom';
import BookingDetailLeftSideMid from './BookingDetailLeftSideMid';
import BookingDetailLeftSideTop from './BookingDetailLeftSideTop';
export type BookingType = {
  booking: ReturnBooking | undefined | null;
};
const BookingDetailLeftSide = ({ booking }: BookingType) => {
  return (
    <div className="max-w-[712px] w-full p-6 border rounded-md text-[#09090B]">
      <BookingDetailLeftSideTop booking={booking} />
      <div className="my-10 w-full bg-[#E4E4E7] h-[1px]"></div>
      <BookingDetailLeftSideMid booking={booking} />
      <div className="my-10 w-full bg-[#E4E4E7] h-[1px]"></div>
      <BookingDetailLeftSideBottom />
    </div>
  );
};
export default BookingDetailLeftSide;
