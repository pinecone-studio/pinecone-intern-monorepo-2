'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@mui/material';
import { DialogDescription } from '@radix-ui/react-dialog';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const Page = () => {
  const [open, setOpen] = useState(false);
  return (
    <div data-cy="get-cancel-booking-page" className="container mx-auto max-w-[690px] bg-pink-200">
      <Dialog open={open}>
        <DialogContent>
          <div data-cy={`open-dialog`}>
            <DialogTitle data-cy="Cancel-booking-text" className="text-[20px] font-semibold">
              <div>Cancel booking?</div>
            </DialogTitle>
            <DialogDescription>The property won't change you.</DialogDescription>
          </div>
          <div className="flex gap-3 justify-end">
            <Button data-cy="Keep-booking-button" onClick={() => setOpen(false)} className="bg-white text-black border-2">
              keep booking
            </Button>
            <Button data-cy="confirm-button" className="bg-[#2563EB]">
              Confirm cancellation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="py-8 pl-8">
        <Button data-cy="ChevronLeft" variant="outline" size="icon">
          <ChevronLeft />
        </Button>
      </div>
      <div className="px-8 pb-[86px]">
        <div className="pt-22 pb-6">
          <p data-cy="Cancellation-rules" className="pb-4 text-[20px] font-semibold">
            Cancellation rules
          </p>
          <p>Free cancellation until Jun 30 at 4:00 pm (Pacific Standard Time (US & Canada); Tijuana).</p>
          <p className="py-3">f you cancel or change your plans, please cancel your reservation in accordance with the property's cancellation policies to avoid a no-show charge.</p>
          <p className="pb-3">I There is no charge for cancellations made before 4:00 pm (property local time) on Jun 30, 2024.</p>
          <p>
            Cancellations or changes made after 4:00 pm (property local time) on Jun 30, 2024, or no-shows are subject to a property fee equal to 100% of the total amount paid for the reservation.
          </p>
        </div>
        <div className="border-y-2 pb-8 pt-6">
          <p data-cy="Standard-single-room" className="text-[18px] font-semibold pb-3">
            Standard Single Room, 1 King Bed
          </p>

          <Button data-cy="Open-Dialog-Button" onClick={() => setOpen(true)} className="bg-[#2563EB] text-[14px] w-full">
            Cancel Booking
          </Button>
        </div>

        <p className="text-[18px] font-semibold pb-3 pt-6">Property Support</p>
        <p className="pb-3">For special request or questions about your reservation, contact Chingis Khan Hotel</p>
        <div className="pb-3">
          <p className="text-[14px] text-[#71717A] pb-1">Itinerary:</p>
          <p>72055771948934</p>
        </div>

        <div className="flex justify-center border-2 p-2 rounded-md">Call +976 7270 0800</div>
      </div>
    </div>
  );
};
export default Page;
