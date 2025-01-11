import React from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';
import { Room, RoomType } from '@/generated';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  room: Room;
};

const ImagesDialog = ({ open, setOpen, room }: AddHotelGeneralInfoType) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>General Info</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2">
          {room?.images?.map((image, index) => (
            <Image className={`${index == 0 && 'col-span-2'}`} src={String(image)} height={100} width={100} alt="room photo" />
          ))}
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full mt-6">
            <div>
              <Button data-cy="Images-Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" data-cy="Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImagesDialog;
