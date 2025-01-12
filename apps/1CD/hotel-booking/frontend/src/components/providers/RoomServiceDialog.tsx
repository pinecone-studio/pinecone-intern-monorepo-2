import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Room, useAddRoomServiceMutation } from '@/generated';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { Option } from './GeneralinfoDialog';
import { toast } from 'react-toastify';

export type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  room: Room | undefined;
};
type RoomService = {
  bathroom: Option[];
  accessability: Option[];
  entertaiment: Option[];
  foodDrink: Option[];
  bedroom: Option[];
  other: Option[];
};

const RoomServiceDialog: React.FC<DialogType> = ({ open, setOpen, room }) => {
  const [roomService, setRoomService] = useState<RoomService>({
    bathroom: [],
    accessability: [],
    entertaiment: [],
    foodDrink: [],
    bedroom: [],
    other: [],
  });
  const [addRoomService] = useAddRoomServiceMutation();

  const options: Option[] = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'tv', label: 'TV' },
    { value: 'ac', label: 'Air Conditioning' },
  ];

  const handleSave = async () => {
    if (!room?.id) return;
    try {
      await addRoomService({
        variables: {
          roomId: room.id,
          input: {
            bathroom: roomService.bathroom.map((bath) => bath.value),
            accessability: roomService.accessability.map((acc) => acc.value),
            entertaiment: roomService.entertaiment.map((ent) => ent.value),
            foodDrink: roomService.foodDrink.map((food) => food.value),
            other: roomService.other.map((other) => other.value),
            bedroom: roomService.bedroom.map((bed) => bed.value),
          },
        },
      });
      toast("successfully update room's general info", {
        style: {
          border: 'green solid 1px',
          color: 'green',
        },
      });
      setOpen(false);
    } catch (err) {
      console.error('Failed to update room info:', err);
    }
  };

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
          <div className="flex flex-col gap-2">
            <Label>Bathroom</Label>
            <div>
              <MultiSelect options={options} value={roomService.bathroom} onValueChange={handleMultiSelect} data-cy="Update-Room-Info-Multi-Select" placeholder="Select options..." />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Accessibility</Label>
            <div>
              <MultiSelect options={options} value={roomService.accessability} onValueChange={handleMultiSelect} data-cy="Update-Room-Info-Multi-Select" placeholder="Select options..." />
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
