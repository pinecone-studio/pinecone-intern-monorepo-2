import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Room } from '@/generated';
import { Badge } from '@/components/ui/badge';

export type DialogStates = {
  openGen: boolean;
  setOpenGen: (_: boolean) => void;
};
export type RoomProps = DialogStates & {
  room: Room | undefined;
};

const GeneralInfoDialog: React.FC<RoomProps> = ({ openGen, setOpenGen, room }) => {
  const [hotelName, setHotelName] = React.useState(room?.hotelId?.hotelName || '');

  return (
    <Dialog open={openGen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>General Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hotelName">Name</Label>
            <Input value={hotelName} type="text" onChange={(e) => setHotelName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Input value={hotelName} type="text" onChange={(e) => setHotelName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price per night</Label>
            <Input value={hotelName} type="text" onChange={(e) => setHotelName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Room information</Label>
            <div className="flex flex-wrap gap-2 pb-3 pl-2 border rounded-lg min-h-16">
              {room?.roomInformation?.map((info, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200">{info}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <div className="flex justify-between w-full mt-6">
            <div>
              <Button data-cy="General-Info-Cancel-Button" onClick={() => setOpenGen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" data-cy="General-Info-Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralInfoDialog;
