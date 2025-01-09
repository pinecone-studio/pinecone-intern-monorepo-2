import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';

const HotelAmenitiesDialog = ({ open, setOpen, hotelId }: { open: boolean; setOpen: (_value: boolean) => void; hotelId: string }) => {
  return (
    <Dialog data-cy="Location-Dialog" open={open}>
      <DialogContent>
        <div className="text-[#09090B] text-foreground">Location</div>

        <div className="flex justify-between">
          <Button onClick={() => setOpen(false)} className="text-black bg-white border hover:bg-slate-100 active:bg-slate-200">
            Cancel
          </Button>
          <Button onClick={updateHotelLocation} className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-600">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default HotelAmenitiesDialog;
