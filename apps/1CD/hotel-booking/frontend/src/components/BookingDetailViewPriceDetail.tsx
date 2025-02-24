import { X } from 'lucide-react';
import { BookingType } from './BookingDetailLeftSide';
import { Dialog, DialogContent } from './providers/HotelBookingDialog';
type BookingDetailViewPriceDetailType = {
  openViewPriceDialog: boolean;
  setOpenViewPriceDialog: (_value: boolean) => void;
};

const BookingDetailViewPriceDetail = ({ setOpenViewPriceDialog, booking, openViewPriceDialog }: BookingDetailViewPriceDetailType & BookingType) => {
  return (
    <Dialog open={openViewPriceDialog}>
      <DialogContent className="max-w-[626px] w-full text-[#09090B]">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold">Price Detail</div>
          <button data-testid="Close-View-Price-Dialog-Button" className="outline-none" onClick={() => setOpenViewPriceDialog(false)}>
            <X width={16} height={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex flex-col gap-1">
            <div className="text-[#18181B]">1 night</div>
            <div className="text-[#71717A]">{booking?.roomId?.price}₮ per night</div>
          </div>
          <div className="text-[#18181B]">{booking?.roomId?.price}₮</div>
        </div>
        <div className="flex justify-between items-center text-[#18181B] text-sm">
          <div>Taxes</div>
          <div>12,000₮</div>
        </div>
        <div className="my-4 w-full bg-[#E4E4E7] h-[1px]"></div>
        <div className="flex items-center justify-between">
          <div className="text-sm">Total price</div>
          <div className="text-lg">162,000₮</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BookingDetailViewPriceDetail;
