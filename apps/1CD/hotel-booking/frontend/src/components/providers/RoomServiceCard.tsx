import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { CardContent } from '@mui/material';

import React from 'react';
import RoomServiceDialog from './RoomServiceDialog';
import { Room } from '@/generated';
type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  room: Room | undefined;
  refetch: () => void;
};

const RoomServiceCard: React.FC<DialogType> = ({ open, setOpen, refetch, room }) => {
  return (
    <Card className="w-[780px] h-[600px] shadow-lg">
      <CardHeader className="flex flex-row justify-between border-b-[1px]">
        <h3 className="font-semibold">Room Services</h3>
        <button className="text-blue-600" onClick={() => setOpen(true)} data-cy="Room-Service-Dialog-Button">
          Edit
        </button>
      </CardHeader>
      <div data-cy={`Room-Services-Dialog`}>
        <RoomServiceDialog refetch={refetch} open={open} setOpen={setOpen} room={room} />
      </div>
      <CardContent className="flex flex-row justify-between">
        <section className="flex flex-col flex-1 gap-8">
          <div>
            <p className="font-light text-gray-500">Bathroom</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.bathroom?.map((bath, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{bath}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Bedroom</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.bedroom?.map((bdr, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{bdr}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Food and drink</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.foodDrink?.map((fd, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{fd}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-10">
          <div>
            <p className="font-light text-gray-500">Accesabillity</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.accessability?.map((accs, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{accs}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Internet</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.entertaiment?.map((ent, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{ent}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Other</p>
            <div className="flex flex-wrap gap-2">
              {room?.roomService?.other?.map((oth, index) => (
                <div className="pt-3" key={index}>
                  <Badge className="text-black bg-slate-200 hover:bg-slate-300">{oth}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default RoomServiceCard;
