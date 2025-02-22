'use client';
import CheckLoginUser from '@/components/providers/CheckLoginUser';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';
import { BookingStatus, useGetBookingQuery, useUpdateBookingStatusMutation } from '@/generated';

import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });
  const [updateStatus] = useUpdateBookingStatusMutation();
  const udpateBookingStatus = async () => {
    updateStatus({
      variables: {
        id: params.id,
        status: BookingStatus.Cancelled,
      },
    });
    toast('Booking is succussfully cancelled', {
      style: {
        color: 'green',
        borderColor: 'green',
      },
    });
    setOpen(false);
    router.push('/booking');
  };
  return (
    <CheckLoginUser>
      <div data-cy="get-cancel-booking-page" className="container mx-auto max-w-[690px]">
        <Dialog open={open}>
          <DialogContent>
            <div data-cy={`Open-Dialog`}>
              <DialogTitle data-cy="Cancel-booking-text" className="text-[20px] font-semibold">
                Cancel booking?
              </DialogTitle>
              <DialogDescription>{"The property won't change you."}</DialogDescription>
            </div>
            <div className="flex justify-end gap-3">
              <Button data-cy="Keep-booking-button" onClick={() => setOpen(false)} className="text-black bg-white border-2 hover:bg-slate-100">
                keep booking
              </Button>
              <Button disabled={data?.getBooking.status == BookingStatus.Cancelled} data-cy="Confirm-Button" className="bg-[#2563EB] hover:bg-blue-500" onClick={udpateBookingStatus}>
                Confirm cancellation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="py-8 pl-8">
          <Button data-cy="ChevronLeft" variant="outline" size="icon" onClick={() => router.push(`/booking-detail/${params.id}`)}>
            <ChevronLeft />
          </Button>
        </div>
        <div className="px-8 pb-[86px]">
          <div className="pb-6 pt-22">
            <p data-cy="Cancellation-rules" className="pb-4 text-[20px] font-semibold">
              Cancellation rules
            </p>
            <p>Free cancellation until Jun 30 at 4:00 pm (Pacific Standard Time (US & Canada); Tijuana).</p>
            <p className="py-3">{"If you cancel or change your plans, please cancel your reservation in accordance with the property's cancellation policies to avoid a no-show charge."}</p>
            <p className="pb-3">I There is no charge for cancellations made before 4:00 pm (property local time) on Jun 30, 2024.</p>
            <p>
              Cancellations or changes made after 4:00 pm (property local time) on Jun 30, 2024, or no-shows are subject to a property fee equal to 100% of the total amount paid for the reservation.
            </p>
          </div>
          <div className="pt-6 pb-8 border-y-2">
            <p data-cy="Standard-single-room" className="text-[18px] font-semibold pb-3">
              Standard Single Room, 1 King Bed
            </p>

            <Button data-cy="Open-Dialog-Button" onClick={() => setOpen(true)} className="bg-[#2563EB] text-[14px] w-full hover:bg-blue-500">
              Cancel Booking
            </Button>
          </div>

          <p className="text-[18px] font-semibold pb-3 pt-6">Property Support</p>
          <p className="pb-3">For special request or questions about your reservation, contact Chingis Khan Hotel</p>
          <div className="pb-3">
            <p className="text-[14px] text-[#71717A] pb-1">Itinerary:</p>
            <p>72055771948934</p>
          </div>

          <div className="flex justify-center p-2 border-2 rounded-md">Call +976 7270 0800</div>
        </div>
      </div>
    </CheckLoginUser>
  );
};
export default Page;
