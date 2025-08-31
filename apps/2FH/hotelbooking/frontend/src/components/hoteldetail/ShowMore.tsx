'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  onOpenChange: (open: boolean) => void;
  rooms: Room;
};
export const ShowMore = ({ open, onOpenChange, rooms }: ShowMoreProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.imageURL.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === rooms.imageURL.length - 1 ? 0 : prev + 1));
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[626px] max-w-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Room Information</DialogTitle>
            <DialogDescription className="flex flex-col gap-y-5">
              <div className="relative w-[578px] h-[325px]">
                <Image src={rooms.imageURL[currentIndex] ?? '/fallback.jpg'} alt="RoomImages" fill className="object-cover rounded-lg" />
                <div onClick={handlePrev} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white w-10 h-10 rounded-md flex items-center justify-center shadow cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </div>

                <div onClick={handleNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white w-10 h-10 rounded-md flex items-center justify-center shadow cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-lg font-semibold">{rooms.name}</h3>

              <div className="grid grid-cols-3 grid-rows-4 gap-x-4 gap-y-8">
                {rooms.roomInformation.slice(0, 12).map((info, index) => (
                  <div key={index} className="flex gap-x-2">
                    <Zap className="w-4 h-4" />
                    <span className="capitalize">{info.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-x-4 ">
                <div className="flex flex-col w-[281px]">
                  <h3 className="text-base font-bold">Accessibility</h3>
                  {rooms.accessibility.map((acess, index) => (
                    <li key={index} className="text-sm font-normal capitalize">
                      {acess.replace(/_/g, ' ')}
                    </li>
                  ))}
                </div>
                <div>
                  <h3 className="text-base font-bold">Bathroom</h3>
                  {rooms.bathroom.map((bath, index) => (
                    <li key={index} className="text-sm font-normal capitalize">
                      {bath.replace(/_/g, ' ')}
                    </li>
                  ))}
                </div>
              </div>

              <div className="flex gap-x-4 ">
                <div className="flex flex-col w-[281px]">
                  <h3 className="text-base font-bold">Bedroom</h3>
                  {rooms.bedRoom.map((acess, index) => (
                    <li key={index} className="text-sm font-normal capitalize">
                      {acess.replace(/_/g, ' ')}
                    </li>
                  ))}
                </div>
                <div>
                  <h3 className="text-base font-bold">Entertainment</h3>
                  {rooms.entertainment.map((enter, index) => (
                    <li key={index} className="text-sm font-normal capitalize">
                      {enter.replace(/_/g, ' ')}
                    </li>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold">More</h3>
                {rooms.other.map((enter, index) => (
                  <li key={index} className="text-sm font-normal capitalize">
                    {enter.replace(/_/g, ' ')}
                  </li>
                ))}
              </div>

              <div className="flex flex-col gap-y-1 border border-solid rounded-lg px-4 py-4">
                <p className="text-xs font-normal text-gray-500">Total</p>
                <p className="text-sm font-medium">{new Intl.NumberFormat('en-US').format(rooms.pricePerNight * 2)} ₮</p>

                <div className="flex  items-center gap-y-1">
                  <span className="text-base font-medium">{new Intl.NumberFormat('en-US').format(rooms.pricePerNight)} ₮</span>
                  <p className="text-xs font-normal">Price per night</p>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-x-2 text-blue-600 items-center">
                    <p className="text-sm font-medium ">Price detail</p>
                    <ChevronRight className="w-4 h-4" />
                  </div>

                  <Button className="w-[70px] bg-blue-600 text-sm font-medium">Reserve</Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
