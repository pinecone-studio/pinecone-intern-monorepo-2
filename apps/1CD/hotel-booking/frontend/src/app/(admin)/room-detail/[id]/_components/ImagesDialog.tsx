import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};

const ImagesDialog = ({ open, setOpen }: AddHotelGeneralInfoType) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>General Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="border h-52 rounded-xl">
            <Image src="/" height={100} width={100} alt="room photo" />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-1 pt-1 border">
            <div className="w-40 h-32 border"></div>
            <div className="w-40 h-32 border"></div>
            <div className="w-40 h-32 border"></div>
          </div>
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
