import React from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
export type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};
const RoomServiceDialog = ({ open, setOpen }: DialogType) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Room Services</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label>Bathroom</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Accessibility</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Entertaiment</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Food and drinknk</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Bedroom</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Other</Label>
            <Input />
          </div>
        </div>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <div className="flex justify-between w-full mt-6">
            <div>
              <Button data-cy="Room-Services-Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" data-cy="Room-Services-Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomServiceDialog;
