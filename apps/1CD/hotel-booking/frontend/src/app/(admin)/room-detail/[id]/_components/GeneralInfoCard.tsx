import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import GeneralInfoDialog from './GeneralinfoDialog';

export type DialogOpenType = {
  openGen: boolean;
  setOpenGen: (_: boolean) => void;
};

const GeneralInfoCard = ({ openGen, setOpenGen }: DialogOpenType) => {
  return (
    <Card className="w-[780px] h-[350px] shadow-lg">
      <CardHeader className="flex flex-row justify-between border-b-[1px]">
        <h3 className="font-semibold">General Info</h3>
        <Button variant="link" className="text-blue-600" data-cy="General-Info-Dialog-Button" onClick={() => setOpenGen(true)}>
          Edit
        </Button>
      </CardHeader>
      <div data-cy={`General-Info-Fields-Dialog`}>
        <GeneralInfoDialog openGen={openGen} setOpenGen={setOpenGen} />
      </div>
      <CardContent>
        <div className="flex flex-row flex-1 gap-32 pt-5">
          <ul>
            <li className="font-light text-gray-500">Name</li>
            <li>Economy Single Room</li>
          </ul>
          <ul>
            <li className="font-light text-gray-500">Type</li>
            <li>Single</li>
          </ul>
          <ul>
            <li className="font-light text-gray-500">Price per night</li>
            <li>150,000</li>
          </ul>
        </div>
        <div className="flex flex-col items-start pt-6">
          <p className="font-light text-gray-500">Room information</p>
          <div className="flex items-between">
            <div className="flex  flex-col flex-wrap gap-2 max-h-[160px]">
              <div className="flex items-center gap-2 pt-1">
                <Zap size={16} />
                <p>Free breakfast</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoCard;
