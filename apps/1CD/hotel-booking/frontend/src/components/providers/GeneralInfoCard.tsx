import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import GeneralInfoDialog from './GeneralinfoDialog';
import { Room } from '@/generated';

export type DialogOpenType = {
  openGen: boolean;
  setOpenGen: (_: boolean) => void;
};

export type GeneralInfoCardProps = DialogOpenType & {
  roomData: Room | undefined;
};

const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({ openGen, setOpenGen, roomData }) => {
  return (
    <Card className="w-[780px] h-[400px] shadow-lg">
      <CardHeader className="flex flex-row justify-between border-b-[1px]">
        <h3 className="font-semibold">General Info</h3>
        <Button variant="link" className="text-blue-600" data-cy="General-Info-Dialog-Button" onClick={() => setOpenGen(true)}>
          Edit
        </Button>
      </CardHeader>
      <div data-cy="General-Info-Fields-Dialog">
        <GeneralInfoDialog openGen={openGen} setOpenGen={setOpenGen} room={roomData} />
      </div>
      <CardContent>
        <div className="flex flex-row justify-between flex-1 pt-5 ">
          <div>
            <ul>
              <li className="font-light text-gray-500">Name</li>
              <li>{roomData?.roomName || 'N/A'}</li>
            </ul>
            <div className="flex flex-col items-start pt-6">
              <p className="font-light text-gray-500">Room information</p>
              <div className=" flex flex-col max-h-[110px] mt-3 gap-2">
                {roomData?.roomInformation?.slice(0, 3).map((info, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Zap size={16} />
                    <p className="font-medium text-gray-800">{info}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <ul>
              <li className="font-light text-gray-500">Type</li>
              <li>{roomData?.roomType || 'N/A'}</li>
            </ul>
            <div className="flex flex-col max-h-[110px] gap-2 mt-14" data-cy="Room-Information-Map">
              {roomData?.roomInformation?.slice(3, 5).map((info, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Zap size={16} />
                  <p className="font-medium text-gray-800">{info}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ul>
              <li className="font-light text-gray-500">Price per night</li>
              <li>{roomData?.price?.toLocaleString() || 'N/A'}</li>
            </ul>
            <div className="flex flex-col max-h-[110px] gap-2 mt-14">
              {roomData?.roomInformation?.slice(3, 5).map((info, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Zap size={16} />
                  <p className="font-medium text-gray-800">{info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoCard;
