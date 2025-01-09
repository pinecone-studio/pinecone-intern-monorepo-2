import React from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Room } from '@/generated';
import { Badge } from '@/components/ui/badge';
export type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};
export type RoomProps = DialogType & {
  room: Room | undefined;
};
const RoomServiceDialog: React.FC<RoomProps> = ({ open, setOpen, room }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Room Services</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label>Bathroom</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.bathroom?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Accessibility</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.accessability?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Entertaiment</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.entertaiment?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Food and drink</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.foodDrink?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Bedroom</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.bedroom?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Other</Label>
            <div className="flex flex-wrap gap-2 pl-2 border rounded-lg min-h-16">
              {room?.roomService?.other?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{bath}</Badge>
                </div>
              ))}
            </div>
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
