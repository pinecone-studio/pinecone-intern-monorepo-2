'use client';
import { RoomType } from '@/generated';
import { Car, ChevronRight, DoorClosed, DumbbellIcon, FlowerIcon, ParkingCircleIcon, Utensils, WifiIcon } from 'lucide-react';
import HotelRoomDetail from './HotelRoomDetail';
import { useCallback, useState } from 'react';
import Image from 'next/image';

import PriceDetail, { handleReserve, totalPrice } from './PriceDetail';
import DisplayTugrug from '@/components/DisplayTugrug';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';

const RoomCard = ({ room }: { room: RoomType }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dateTo] = useQueryState('dateTo');
  const [dateFrom] = useQueryState('dateFrom');
  const { user } = useAuth();
  const handleState = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isOpen]);
  const [isOn, setIsOn] = useState(false);
  const handleOpen = () => {
    setIsOpen(false);
    if (isOn) {
      setIsOn(false);
    } else {
      setIsOn(true);
    }
  };

  return (
    <div data-cy="Room-Card" className="border border-solid 1px rounded-md w-full h-full max-w-[349px]">
      <div className="bg-[#EBEBEB] w-full h-[216px]">
        <Image className="object-cover w-full h-full" src={room?.images[0]} alt="room image" width={500} height={500} data-cy="Room-image" />
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="text-base font-bold">{room?.roomName}</div>
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
            <div className="py-2">
              <button data-cy="Show-More" onClick={handleState} className="flex gap-2 items-center text-sm font-medium text-[#2563EB] hover:font-semibold ">
                Show more
                <ChevronRight className="w-4 h-4 text-[#2563EB]" />
              </button>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="w-[317px] border border-solid 1px bg-[#E4E4E7]"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-normal text-[#71717A]">Total</p>
            <DisplayTugrug tugrug={totalPrice(dateFrom, dateTo, Number(room.price))} />
            <div className="flex items-center gap-1">
              <p className="text-sm">{room.price?.toLocaleString()}</p>
              <div className="text-xs font-normal text-[#000000]">Price per night</div>
            </div>
            <div className="py-2">
              <button data-cy="Price-Detail-Button" className="flex gap-2 items-center text-sm font-medium text-[#2563EB]  hover:font-semibold cursor-pointer" onClick={handleOpen}>
                Price detail
                <ChevronRight className="w-4 h-4 text-[#2563EB]" />
              </button>
            </div>
          </div>
          <div className="pt-14">
            <Button data-cy="Reserve-Button" onClick={() => handleReserve(user, router, dateTo, dateFrom, String(room._id))} className="text-sm font-medium bg-blue-700 hover:bg-blue-500">
              Reserve
            </Button>
          </div>
        </div>
        <HotelRoomDetail data-cy="Hotel-Room-Detail" isOpen={isOpen} handleOpen={handleOpen} handleState={handleState} room={room} />
        <PriceDetail data-cy="Price-Detail-Dialog" isOn={isOn} handleOpen={handleOpen} room={room} />
      </div>
    </div>
  );
};
export default RoomCard;
