'use client';
import { Button } from '@/components/ui/button';

const BookingDetailLeftSideBottom = () => {
  return (
    <div className="flex flex-col gap-4 text-[#09090B]">
      <div className="flex flex-col gap-2">
        <div className="text-xl">Pedia support</div>
        <div className="text-[#71717A] text-sm">Contact Pedia if you need help managing this Itinerary</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[#71717A] text-sm">Itinerary</div>
        <div className="text-base">72055771948934</div>
      </div>

      <Button className="text-[#18181B] bg-[#FFFFFF] hover:bg-slate-50 border active:bg-slate-100">Call +976 70080072</Button>
    </div>
  );
};

export default BookingDetailLeftSideBottom;
