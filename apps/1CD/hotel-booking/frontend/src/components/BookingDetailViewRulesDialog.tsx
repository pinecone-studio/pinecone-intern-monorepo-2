import { X } from 'lucide-react';
import { Dialog, DialogContent } from './providers/HotelBookingDialog';
type BookingDetailViewRulesDialogType = {
  setOpenViewRulesDialog: (_value: boolean) => void;
  openViewRulesDialog: boolean;
};

const BookingDetailViewRulesDialog = ({ setOpenViewRulesDialog, openViewRulesDialog }: BookingDetailViewRulesDialogType) => {
  return (
    <Dialog open={openViewRulesDialog}>
      <DialogContent className="max-w-[626px] w-full text-[#09090B]">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold">Rules & restrictions</div>
            <button data-testid="Close-View-Rules-Dialog-Button" className="outline-none" onClick={() => setOpenViewRulesDialog(false)}>
              <X width={16} height={16} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Cancellation</div>
            <ul className="ml-6 text-sm list-disc">
              <li>Free cancellation until 48 hours before check-in.</li>
              <li>Cancellations made after this period or no-shows will be charged the first night’s stay.</li>
            </ul>
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Payment</div>
            <ul className="ml-6 text-sm list-disc">
              <li>A 20% deposit is required at the time of booking.</li>
              <li>The remaining balance is due at check-in.</li>
            </ul>
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Smoking</div>
            <div className="text-sm">This is a non-smoking property. A $200 cleaning fee will be charged for smoking in rooms.</div>
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Damage:</div>
            <div className="text-sm">Guests are responsible for any damage to the room during their stay.</div>
          </div>
          <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Health & Safety</div>
            <div className="text-sm">Guests must follow our health and safety guidelines, including wearing masks in common areas.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BookingDetailViewRulesDialog;
