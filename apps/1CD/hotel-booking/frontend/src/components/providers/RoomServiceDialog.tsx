/* eslint-disable */
import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Room, useAddRoomServiceMutation } from '@/generated';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { Option } from './GeneralinfoDialog';
import { toast } from 'sonner';

export type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  room: Room | undefined;
  refetch: () => void;
};
type RoomService = {
  bathroom: Option[];
  accessability: Option[];
  entertaiment: Option[];
  foodDrink: Option[];
  bedroom: Option[];
  other: Option[];
};
const options = [
  { value: 'Towels', label: 'Towels' },
  { value: 'Shampoo', label: 'Shampoo' },
  { value: 'Wi-Fi', label: 'Wi-Fi' },
  { value: 'Television', label: 'Television' },
  { value: 'Room Service', label: 'Room Service' },
  { value: 'Breakfast Included', label: 'Breakfast Included' },
];
const RoomServiceDialog: React.FC<DialogType> = ({ open, refetch, setOpen, room }) => {
  const [roomService, setRoomService] = useState<RoomService>({
    bathroom: [],
    accessability: [],
    entertaiment: [],
    foodDrink: [],
    other: [],
    bedroom: [],
  });
  const [addRoomService] = useAddRoomServiceMutation({
    onCompleted: () => refetch(),
  });
  const handleMultiSelect = (category: keyof RoomService, value: Option[]) => {
    setRoomService((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  useEffect(() => {
    if (room?.roomService) {
      const mapToOptions = (service: any[]) =>
        service.map((oneInformation) => ({
          value: String(oneInformation),
          label: String(oneInformation),
        }));

      const services = {
        bathroom: room.roomService.bathroom ? mapToOptions(room.roomService.bathroom) : [],
        accessability: room.roomService.accessability ? mapToOptions(room.roomService.accessability) : [],
        entertaiment: room.roomService.entertaiment ? mapToOptions(room.roomService.entertaiment) : [],
        foodDrink: room.roomService.foodDrink ? mapToOptions(room.roomService.foodDrink) : [],
        bedroom: room.roomService.bedroom ? mapToOptions(room.roomService.bedroom) : [],
        other: room.roomService.other ? mapToOptions(room.roomService.other) : [],
      };

      setRoomService(services);
    }
  }, [room]);
  const submit = async () => {
    await addRoomService({
      variables: {
        roomId: String(room?.id),
        input: {
          bathroom: roomService.bathroom.map((bathroom) => bathroom.value),
          accessability: roomService.accessability.map((bathroom) => bathroom.value),
          entertaiment: roomService.entertaiment.map((bathroom) => bathroom.value),
          foodDrink: roomService.foodDrink.map((bathroom) => bathroom.value),
          bedroom: roomService.bedroom.map((bathroom) => bathroom.value),
          other: roomService.other.map((bathroom) => bathroom.value),
        },
      },
    });
    setOpen(false);
    toast('successfully updated room services', {
      style: {
        border: 'green solid 1px',
        color: 'green',
      },
    });
  };
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Room Services</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-4 mt-2">
            {Object.keys(roomService).map((category) => (
              <div key={category} className="flex flex-col gap-2">
                <Label>{category.charAt(0).toUpperCase() + category.slice(1)}</Label>
                <MultiSelect
                  options={options}
                  value={roomService[category as keyof RoomService]}
                  onValueChange={(value) => handleMultiSelect(category as keyof RoomService, value)}
                  placeholder="Select options..."
                />
              </div>
            ))}
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
              <Button onClick={submit} data-cy="Room-Services-Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
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
