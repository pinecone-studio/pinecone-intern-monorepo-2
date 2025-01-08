'use client';

import { RoomType } from '@/generated';
import RoomCarousel from './HotelRoomCarousel';
import { ChevronRight, X, Zap } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';

import { handleReserve, totalPrice } from './PriceDetail';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useAuth } from '@/components/providers';
import DisplayTugrug from '@/components/DisplayTugrug';

const HotelRoomDetail = ({ room, handleState, handleOpen, isOpen }: { room: RoomType; isOpen: boolean; handleState: () => void; handleOpen: () => void }) => {
  const router = useRouter();
  const [dateTo] = useQueryState('dateTo');
  const [dateFrom] = useQueryState('dateFrom');
  const { user } = useAuth();

  return (
    <div data-cy="Hotel-Room-Detail" className="container items-center mx-auto">
      <Dialog open={isOpen} data-cy="RoomDetailDialog">
        <DialogContent className="flex flex-col gap-5 max-h-[800px] overflow-y-scroll">
          <DialogHeader>
            <div className="flex justify-between">
              <div className="text-base font-bold text-foreground">Room information</div>
              <button data-cy="Room-Dialog-Close" className="outline-none" onClick={handleState}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          {room?.images && <RoomCarousel roomImages={room.images} data-cy="HotelRoomCarousel" />}
          <DialogTitle>{room?.roomName}</DialogTitle>
          <div className="grid grid-cols-3 col-span-3 gap-8">
            {room?.amenities?.map((amenity) => (
              <div key={room._id} className="flex gap-2">
                <Zap className="w-4 h-4" />
                <div className="text-sm font-normal">{amenity}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 col-span-1 gap-y-5">
              <div>
                <ul className="text-base font-bold text-foreground">Accessability</ul>
                {room.roomService?.accessability?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
              <div>
                <ul className="text-base font-bold text-foreground">Bathroom</ul>
                {room.roomService?.bathroom?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>

              <div>
                <ul className="text-base font-bold text-foreground">Bedroom</ul>
                {room.roomService?.bedroom?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
              <div>
                <ul className="text-base font-bold text-foreground">Bathroom</ul>
                {room.roomService?.bathroom?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
              <div>
                <ul className="text-base font-bold text-foreground">Food and drink</ul>
                {room.roomService?.foodDrink?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
              <div>
                <ul className="text-base font-bold text-foreground">Internet</ul>
                {room.roomService?.entertaiment?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
              <div>
                <ul className="text-base font-bold text-foreground">More</ul>
                {room.roomService?.other?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-normal text-[#71717A]">Total</p>
              <DisplayTugrug tugrug={totalPrice(dateFrom, dateTo, Number(5000))} />
              <div className="flex gap-1">
                <div className="text-xs font-normal text-[#000000]">75000</div>
                <div className="text-xs font-normal text-[#000000]">Price per night</div>
              </div>
              <div className="flex items-center gap-2 py-2" onClick={handleOpen}>
                <div className="text-sm font-medium text-[#2563EB]  hover:font-semibold cursor-pointer">Price detail</div>
                <ChevronRight className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="pt-14">
              <button
                data-cy="Reserve-Button"
                className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-sm hover:bg-blue-500"
                onClick={() => handleReserve(user, router, dateTo, dateFrom, String(room._id))}
              >
                Reserve
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default HotelRoomDetail;
