'use client';
import { DialogDescription, Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { RoomType } from '@/generated';
import RoomCarousel from './HotelRoomCarousel';
import { ChevronRight, X, Zap } from 'lucide-react';
import Link from 'next/link';

const HotelRoomDetail = ({ room, handleState, handleOpen, isOpen }: { room: RoomType; isOpen: boolean; handleState: () => void; handleOpen: () => void }) => {
  return (
    <div data-cy="Hotel-Room-Detail" className="container mx-auto items-center">
      <Dialog open={isOpen} data-cy="RoomDetailDialog">
        <DialogContent className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex justify-between">
              <div>Room information</div>
              <button data-cy="Room-Dialog-Close" className="outline-none" onClick={handleState}>
                <X />
              </button>
            </DialogTitle>
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
          <DialogDescription>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-y-5 col-span-1">
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
          </DialogDescription>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-normal text-[#71717A]">Total</p>
              <p className="text-xl font-medium text-[#09090B]">150,000₮</p>
              <div className="flex gap-1">
                <div className="text-xs font-normal text-[#000000]">75000</div>
                <div className="text-xs font-normal text-[#000000]">Price per night</div>
              </div>
              <div className="flex gap-2 items-center py-2" onClick={handleOpen}>
                <div className="text-sm font-medium text-[#2563EB]  hover:font-semibold cursor-pointer">Price detail</div>
                <ChevronRight className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="pt-14">
              <Link href={`/checkout/${room._id}`} data-cy="Reserve-button-1" className="bg-[#2563EB] rounded-md py-2 px-3 text-white hover:bg-[#264689]">
                Reserve
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default HotelRoomDetail;
