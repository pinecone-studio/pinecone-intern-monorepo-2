'use client';
import { RoomType } from '@/generated';
import { Car, ChevronRight, DoorClosed, DumbbellIcon, FlowerIcon, ParkingCircleIcon, Utensils, WifiIcon } from 'lucide-react';
import HotelRoomDetail from './HotelRoomDetail';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import PriceDetail from './PriceDetail';
import Link from 'next/link';

const RoomCard = ({ room }: { room: RoomType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleState = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isOpen]);
  const [isOn, setIsOn] = useState(false);
  const handleOpen = useCallback(() => {
    setIsOpen(false);
    if (isOn) {
      setIsOn(false);
    } else {
      setIsOn(true);
    }
  }, [isOn]);
  return (
    <div className="border border-solid 1px rounded-md w-[349px]">
      <div className="bg-[#EBEBEB] w-[349px] h-[216px]">
        <Image src={`${room?.images}`} alt="room image" width={500} height={500} />
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="text-base font-bold">
            Economy Double Room, City View
            {room?.roomName}
          </div>
          <div className="flex flex-col gap-3 py-4">
            <div className="flex gap-2">
              <WifiIcon className="w-4 h-4" />
              <div data-cy="FreeWifi" className="text-sm font-normal">
                Free Wifi
              </div>
            </div>
            <div className="flex gap-2">
              <FlowerIcon className="w-4 h-4" />
              <div className="text-sm font-normal">Spa access</div>
            </div>
            <div className="flex gap-2">
              <ParkingCircleIcon className="w-4 h-4" />
              <div className="text-sm font-normal">Free self parking</div>
            </div>
            <div className="flex gap-2">
              <Utensils className="w-4 h-4" />
              <div className="text-sm font-normal">Complimentary breakfast</div>
            </div>
            <div className="flex gap-2">
              <DumbbellIcon className="w-4 h-4" />
              <div className="text-sm font-normal">Fitness center access</div>
            </div>
            <div className="flex gap-2">
              <Car className="w-4 h-4" />
              <div className="text-sm font-normal">Airport shuttle service</div>
            </div>
            <div className="flex gap-2">
              <DoorClosed className="w-4 h-4" />
              <div className="text-sm font-normal">Room cleaning service</div>
            </div>
            <div className="flex gap-2 items-center py-2">
              <button data-cy="Show-More" onClick={handleState} className="text-sm font-medium text-[#2563EB] hover:font-semibold ">
                Show more
              </button>
              <ChevronRight className="w-4 h-4 text-[#2563EB]" />
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="w-[317px] border border-solid 1px bg-[#E4E4E7]"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-normal text-[#71717A]">Total</p>
            <p className="text-xl font-medium text-[#09090B]">150,000₮</p>
            <div className="flex gap-1">
              <div className="text-xs font-normal text-[#000000]">75000</div>
              <div className="text-xs font-normal text-[#000000]">Price per night</div>
            </div>
            <div className="flex gap-2 items-center py-2">
              <div className="text-sm font-medium text-[#2563EB]  hover:font-semibold cursor-pointer" onClick={handleOpen}>
                Price detail
              </div>
              <ChevronRight className="w-4 h-4 text-[#2563EB]" />
            </div>
          </div>
          <div className="pt-14">
            <Link href={`/checkout/${room._id}`} className="bg-[#2563EB] rounded-md py-2 px-3 text-white">
              Reserve
            </Link>
          </div>
        </div>
        <HotelRoomDetail isOpen={isOpen} handleOpen={() => handleOpen()} handleState={() => handleState()} room={room} />
        <PriceDetail isOn={isOn} handleOpen={() => handleOpen()} room={room} />
      </div>
    </div>
  );
};
export default RoomCard;
