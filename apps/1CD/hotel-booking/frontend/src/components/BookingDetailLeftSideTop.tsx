'use client';
import { Button } from '@/components/ui/button';
import BookingDetailCheckInDialog from './BookingDetailCheckInDialog';
import { useState } from 'react';
import BookingDetailViewPriceDetail from './BookingDetailViewPriceDetail';
import { BookingType } from './BookingDetailLeftSide';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@/generated';

export type BookingDetailLeftSideCheckInDialogType = {
  openCheckInDialog: boolean;
  setOpenCheckInDialog: (_value: boolean) => void;
};
const BookingDetailLeftSideTop = ({ booking }: BookingType) => {
  const router = useRouter();
  const [openCheckInDialog, setOpenCheckInDialog] = useState(false);
  const [openViewPriceDialog, setOpenViewPriceDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div className="flex-1 text-2xl">{booking?.roomId?.hotelId?.hotelName}</div>
        <div className="bg-[#18BA51] rounded-full px-2.5 py-0.5 text-[#FAFAFA]">{booking?.status}</div>
      </div>
      <div className="flex gap-12">
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A] text-sm">Check in</div>
          {booking?.checkInDate && (
            <div className="flex gap-1 text-base">
              <div>{format(booking?.checkInDate, 'EEEE, MMM d,')}</div>
              <div>{format(booking?.checkInDate, 'h:mma')}</div>
            </div>
          )}
        </div>
        <div className="w-[1px] h-[33px] bg-[#E4E4E7]"></div>
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A] text-sm">Check out</div>
          {booking?.checkInDate && (
            <div className="flex gap-1 text-base">
              <div>{format(booking?.checkOutDate, 'EEEE, MMM d,')}</div>

              <div>{format(booking?.checkOutDate, 'h:mma')}</div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div data-testid="Open-CheckIn-Dialog" onClick={() => setOpenCheckInDialog(true)} className="text-[#2563EB] select-none text-sm py-2 hover:cursor-pointer">
          Check-in and special instructions
        </div>
        <div data-testid="Open-View-Price-Details" onClick={() => setOpenViewPriceDialog(true)} className="text-[#2563EB] select-none text-sm py-2 hover:cursor-pointer">
          View pricing details
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button className="bg-[#FFFFFF] border text-[#18181B] hover:bg-slate-50 active:bg-slate-100">Contract property</Button>
        <Button
          data-testid="cancen-booking-button"
          disabled={booking?.status == BookingStatus.Cancelled}
          onClick={() => {
            router.push(`/cancel-booking/${booking?._id}`);
          }}
          className="bg-[#2563EB] text-center p-2 rounded-md text-[#FAFAFA] hover:bg-blue-500 active:bg-blue-600"
        >
          Cancel booking
        </Button>
      </div>
      <BookingDetailCheckInDialog setOpenCheckInDialog={setOpenCheckInDialog} openCheckInDialog={openCheckInDialog} />
      <BookingDetailViewPriceDetail booking={booking} openViewPriceDialog={openViewPriceDialog} setOpenViewPriceDialog={setOpenViewPriceDialog} />
    </div>
  );
};

export default BookingDetailLeftSideTop;
