import { Dispatch, SetStateAction } from 'react';
import { ReserveButton } from './ReserveButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Room } from '@/generated';

type PricedetailProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  room: Room;
  roomId: string;
  hotelId: string;
  adults: number;
  childrens: number;
};

export const PriceDetail = ({ open, onOpenChange, room, roomId, hotelId, adults, childrens }: PricedetailProps) => {
  return (
    <Dialog data-testid="price-detail" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Price Detail</DialogTitle>

          <DialogDescription asChild>
            <div className="flex flex-col gap-y-4 mt-2">
              <div className="flex justify-between">
                <div className="flex flex-col gap-y-[2px]">
                  <span className="text-sm font-normal">2 night</span>
                  <span className="text-sm font-normal">₮75,000 per night</span>
                </div>
                <span className="text-sm font-medium">₮150,000</span>
              </div>

              <div className="border"></div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Total price</span>
                <span className="text-lg font-semibold">₮300,000</span>
              </div>

              <ReserveButton room={room} roomId={roomId} hotelId={hotelId} adults={adults} childrens={childrens} />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
