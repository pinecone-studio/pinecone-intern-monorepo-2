import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Room, useUpdateRoomInfoMutation } from '@/generated';
import { MultiSelect } from '@/components/ui/multi-select';
import { Option } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';
import { toast } from 'sonner';

export type DialogStates = {
  openGen: boolean;
  setOpenGen: (_: boolean) => void;
};
export type RoomProps = DialogStates & {
  room: Room | undefined;
};
export type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  {
    value: '24-hour front desk',
    label: '24-hour front desk',
  },
  {
    value: 'Conceirge services',
    label: 'Conceirge services',
  },
  {
    value: 'Tour/ticket assistance',
    label: 'Tour/ticket assistance',
  },
  {
    value: 'Dry cleaning/laundry services',
    label: 'Dry cleaning/laundry services',
  },
  {
    value: 'Luggage storage',
    label: 'Luggage storage',
  },
  {
    value: 'shower',
    label: 'shower',
  },
];
const GeneralInfoDialog: React.FC<RoomProps> = ({ openGen, setOpenGen, room }) => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomPrice, setRoomPrice] = useState(0);
  const [roomInformation, setRoomInformation] = useState<Option[]>([]);

  const [updateRoomInfo] = useUpdateRoomInfoMutation();

  const handleSave = async () => {
    if (!room?.id) return;
    try {
      await updateRoomInfo({
        variables: {
          input: {
            _id: room?.id,
            roomName: roomName,
            price: roomPrice,
            roomType: roomType,
            roomInformation: roomInformation.map((information) => information.value),
          },
        },
      });
      toast("successfully update room's general info", {
        style: {
          border: 'green solid 1px',
          color: 'green',
        },
      });
      setOpenGen(false);
    } catch (err) {
      console.error('Failed to update room info:', err);
    }
  };
  useEffect(() => {
    if (room?.roomName) setRoomName(room.roomName);
    if (room?.roomType) setRoomType(room.roomType);
    if (room?.price) setRoomPrice(room.price);
    if (room?.roomInformation) {
      const array = room.roomInformation.map((oneInformation) => {
        const object = {} as Option;
        object.value = String(oneInformation);
        object.label = String(oneInformation);
        return object;
      });

      setRoomInformation(array);
    }
  }, [room]);
  const handleMultiSelect = (value: Option[]) => {
    setRoomInformation(value);
  };
  return (
    <Dialog open={openGen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>General Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hotelName">Name</Label>
            <Input value={roomName} type="text" onChange={(e) => setRoomName(e.target.value)} data-cy="Room-Name-Input" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Input value={roomType} type="text" onChange={(e) => setRoomType(e.target.value)} data-cy="Room-Type-Input" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price per night</Label>
            <Input value={roomPrice} type="text" onChange={(e) => setRoomPrice(Number(e.target.value))} data-cy="Room-Price-Input" />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div>Room information</div>
            <div>
              <MultiSelect options={options} value={roomInformation} onValueChange={handleMultiSelect} data-cy="Update-Room-Info-Multi-Select" placeholder="Select options..." />
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
              <Button type="submit" data-cy="General-Info-Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300" onClick={handleSave}>
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
