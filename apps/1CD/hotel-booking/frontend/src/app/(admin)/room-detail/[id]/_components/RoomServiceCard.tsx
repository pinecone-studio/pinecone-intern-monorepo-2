import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { CardContent } from '@mui/material';

import React from 'react';
import RoomServiceDialog from './RoomServiceDialog';
type DialogType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};

const RoomServiceCard = ({ open, setOpen }: DialogType) => {
  return (
    <Card className="w-[780px] h-[500px] shadow-lg">
      <CardHeader className="flex flex-row justify-between border-b-[1px]">
        <h3 className="font-semibold">Room Services</h3>
        <button className="text-blue-600" onClick={() => setOpen(true)} data-cy="Room-Service-Dialog-Button">
          Edit
        </button>
      </CardHeader>
      <div data-cy={`Room-Services-Dialog`}>
        <RoomServiceDialog open={open} setOpen={setOpen} />
      </div>

      <CardContent className="flex flex-row justify-between">
        <section className="flex flex-col flex-1 gap-8">
          <div>
            <p className="font-light text-gray-500">Bathroom</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Bathroom</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Food and drink</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Other</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
        </section>
        <section className="flex flex-col flex-1 gap-10">
          <div>
            <p className="font-light text-gray-500">Accesabillity</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Internet</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
          <div>
            <p className="font-light text-gray-500">Bedroom</p>
            <div className="pt-3">
              <Badge className="text-black bg-slate-200">Bathrobes</Badge>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default RoomServiceCard;
