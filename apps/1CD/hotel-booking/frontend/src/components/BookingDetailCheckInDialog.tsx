import { X } from 'lucide-react';
import { BookingDetailLeftSideCheckInDialogType } from './BookingDetailLeftSideTop';
import { Dialog, DialogContent } from './providers/HotelBookingDialog';

const BookingDetailCheckInDialog = ({ setOpenCheckInDialog, openCheckInDialog }: BookingDetailLeftSideCheckInDialogType) => {
  return (
    <Dialog open={openCheckInDialog}>
      <DialogContent className="max-w-[626px] w-full text-[#09090B]">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold">Check in and special instructions</div>
          <button data-testid="Close-CheckIn-Dialog-Button" className="outline-none" onClick={() => setOpenCheckInDialog(false)}>
            <X width={16} height={16} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">Check-in Process</div>
          <div>Guests are required to present a valid ID and booking confirmation at check-in.</div>
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">Late Check-in</div>
          <div>If you expect to arrive after 8:00 PM, please inform the property in advance to ensure a smooth check-in process.</div>
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">Parking Info</div>
          <div>If you expect to arrive after 8:00 PM, please inform the property in advance to ensure a smooth check-in process.</div>
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">Contact Information</div>
          <div>If you need assistance before your arrival, please contact us at +976 70080072 or support@pedia.mn.</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BookingDetailCheckInDialog;
