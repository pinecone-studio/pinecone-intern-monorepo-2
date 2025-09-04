'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Room = {
  id: string;
  hotelId: string;
  name: string;
  imageURL: (string | null)[];
  pricePerNight: number;
  typePerson: string;
  roomInformation: string[];
  bathroom: string[];
  accessibility: string[];
  internet: string[];
  foodAndDrink: string[];
  bedRoom: string[];
  other: string[];
  entertainment: string[];
  bedNumber: number;
  createdAt: string;
  updatedAt: string;
};

type ShowMoreProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  rooms: Room;
};

// eslint-disable-next-line no-unused-vars
export const ShowMore = ({ open, onOpenChange, rooms }: ShowMoreProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.imageURL.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === rooms.imageURL.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[626px] max-w-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Room Information</DialogTitle>

          {/* Block wrapper instead of DialogDescription */}
          <div className="flex flex-col gap-y-5">
            {/* Image carousel */}
            <div className="relative w-[578px] h-[325px]">
              {rooms?.imageURL[currentIndex] && <Image data-testid="room-info-item-image" src={rooms.imageURL[currentIndex] as string} alt="roomImage" fill className="object-cover rounded-lg" />}

              <div onClick={handlePrev} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white w-10 h-10 rounded-md flex items-center justify-center shadow cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </div>

              <div onClick={handleNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white w-10 h-10 rounded-md flex items-center justify-center shadow cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Room name */}
            <div>
              <h3 className="text-lg font-semibold">{rooms.name}</h3>
            </div>

            {/* Room information */}
            <div className="grid grid-cols-3 grid-rows-4 gap-x-4 gap-y-8">
              {rooms.roomInformation.slice(0, 12).map((info, index) => (
                <div key={index} className="flex gap-x-2">
                  <Zap className="w-4 h-4" />
                  <span className="capitalize">{info.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>

            {/* Accessibility & Bathroom */}
            <div className="flex gap-x-4">
              <div className="flex flex-col w-[281px]">
                <h3 className="text-base font-bold">Accessibility</h3>
                {rooms.accessibility.map((acess, index) => (
                  <div key={index} className="text-sm font-normal capitalize">
                    {acess.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-base font-bold">Bathroom</h3>
                {rooms.bathroom.map((bath, index) => (
                  <div key={index} className="text-sm font-normal capitalize">
                    {bath.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>

            {/* Bedroom & Entertainment */}
            <div className="flex gap-x-4">
              <div className="flex flex-col w-[281px]">
                <h3 className="text-base font-bold">Bedroom</h3>
                {rooms.bedRoom.map((bed, index) => (
                  <div key={index} className="text-sm font-normal capitalize">
                    {bed.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-base font-bold">Entertainment</h3>
                {rooms.entertainment.map((enter, index) => (
                  <div key={index} className="text-sm font-normal capitalize">
                    {enter.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>

            {/* More info */}
            <div>
              <h3 className="text-base font-bold">More</h3>
              {rooms.other.map((other, index) => (
                <div key={index} className="text-sm font-normal capitalize">
                  {other.replace(/_/g, ' ')}
                </div>
              ))}
            </div>

            {/* Price section */}
            <div className="flex flex-col gap-y-1 border border-solid rounded-lg px-4 py-4">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-sm font-medium">{new Intl.NumberFormat('en-US').format(rooms.pricePerNight * 2)} ₮</div>

              <div className="flex items-center gap-y-1">
                <span className="text-base font-medium">{new Intl.NumberFormat('en-US').format(rooms.pricePerNight)} ₮</span>
                <span className="text-xs">Price per night</span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-x-2 text-blue-600 items-center">
                  <span className="text-sm font-medium">Price detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <Button className="w-[70px] bg-blue-600 text-sm font-medium">Reserve</Button>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
