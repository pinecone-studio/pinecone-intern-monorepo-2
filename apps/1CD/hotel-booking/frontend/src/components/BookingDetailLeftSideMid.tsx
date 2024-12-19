'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BookingDetailViewRulesDialog from './BookingDetailViewRulesDialog';
import { BookingType } from './BookingDetailLeftSide';

const BookingDetailLeftSideMid = ({ booking }: BookingType) => {
  const [openViewRulesDialog, setOpenViewRulesDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4 text-[#09090B]">
      <div className="flex flex-col gap-2">
        <div className="text-[#71717A] text-sm">Room detail</div>
        <div className="text-xl">{booking?.roomId?.roomName}</div>
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A] text-sm">Reserved for</div>
          <div className="text-base">Nyamdorj Shagai, 1 adult</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[#71717A] text-sm">Request</div>
          <div className="text-base">Non-Smoking</div>
        </div>
      </div>
      <Button data-testid="View-Rules-Button" onClick={() => setOpenViewRulesDialog(true)} className="text-[#18181B] bg-[#FFFFFF] hover:bg-slate-50 border active:bg-slate-100">
        View rules & restrictions
      </Button>
      <BookingDetailViewRulesDialog openViewRulesDialog={openViewRulesDialog} setOpenViewRulesDialog={setOpenViewRulesDialog} />
    </div>
  );
};

export default BookingDetailLeftSideMid;
