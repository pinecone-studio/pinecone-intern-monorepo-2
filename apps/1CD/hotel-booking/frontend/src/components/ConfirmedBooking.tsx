'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ConfirmedBooking = () => {
  return (
    <div className="max-w-[986px] bg-purple-200">
      <div className="text-2xl font-semibold p-4">Confirmed Booking</div>
      <div className="flex">
        <div className="flex-1 w-[395px] h-[222.19px] border-2">
          <Image src="" alt="image" width={500} height={500}></Image>
        </div>
        <div className="flex-1">
          <div className="px-5 py-5">
            <div className="bg-[#18BA51] text-white text-[12px] rounded-full w-[62px] h-[20px] px-2.5 py-1 flex items-center justify-center ">Booked</div>
            <div className="text-base font-bold">Flower Hotel Ulaanbaatar</div>
            <div className="text-sm font-normal text-[#71717A]">Standard Room, City View, 1 Queen Bed</div>
            <ul className="flex gap-2">
              <li>1 night</li>
              <li>1 adult</li>
              <li>1 room</li>
            </ul>
          </div>
          <div className="flex justify-between px-5 py-5">
            <div>
              <div>Check in: Monday</div>
              <div>Itinerary: 72055771948934</div>
            </div>
            <Button>View Detail</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmedBooking;
