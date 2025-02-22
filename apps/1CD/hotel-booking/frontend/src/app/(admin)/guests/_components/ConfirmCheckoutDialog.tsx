import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';
import { BookingStatus, useUpdateBookingStatusMutation } from '@/generated';
import { toast } from 'react-toastify';

const ConfirmCheckoutDialog = ({ open, id, setOpen, refetch }: { open: boolean; id: string; setOpen: (_value: boolean) => void; refetch: () => void }) => {
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleDialog = () => {
    setOpen(false);
  };
  const updateBookingStatus = async () => {
    await updateStatus({
      variables: {
        id: id,
        status: BookingStatus.Completed,
      },
    });
    refetch();
    toast.success('Successfully updated');
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      <DialogContent data-cy="Checkout-Dialog-Content">
        <DialogHeader className="font-bold">Confirm Checkout</DialogHeader>
        <DialogDescription className="text-[#09090B]">Are you sure you want to proceed with checking out this guest? This action cannot be undone.</DialogDescription>
        <div className="flex justify-end gap-2">
          <Button data-cy="Checkout-Dialog-Cancel-Button" onClick={handleDialog} className="text-[#18181B] hover:bg-slate-100 active:bg-slate-200 bg-[#FFFFFF]">
            Cancel
          </Button>
          <Button data-cy="Checkout-Dialog-Update-Status-Button" onClick={updateBookingStatus} className="bg-[#2563EB] hover:bg-blue-400 active:bg-blue-500">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmCheckoutDialog;
