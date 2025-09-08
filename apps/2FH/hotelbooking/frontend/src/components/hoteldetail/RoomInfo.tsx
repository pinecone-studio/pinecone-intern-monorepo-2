'use client';

import Image from 'next/image';
import { ShowMore } from './ShowMore';
import { useState } from 'react';
import { PriceDetail } from './PriceDetail';
import { useGetRoomsQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import { ReserveButton } from './ReserveButton';
// import { useOtpContext } from '../providers/UserAuthProvider';
import { Wifi, AirVent, Tv, Wine, Droplet, ShowerHead, Toilet, ChevronRight } from 'lucide-react';

type RoomInfoProps = {
  hotelId: string;
};

const infoIcons: Record<string, React.ReactNode> = {
  privateBathroom: <ShowerHead className="w-4 h-4" />,
  sharedBathroom: <Toilet className="w-4 h-4" />,
  airConditioner: <AirVent className="w-4 h-4" />,
  freeBottleWater: <Droplet className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  minibar: <Wine className="w-4 h-4" />,
  wifi: <Wifi className="w-4 h-4" />,
};

export const RoomInfo = ({ hotelId }: RoomInfoProps) => {
  const [showMore, setShowMore] = useState(false);
  const [openPriceDetail, setOpenPriceDetail] = useState(false);
  // const { nights, range } = useOtpContext();

  const handleClickShow = () => {
    setShowMore(true);
  };

  const nights = 2;

  const handleClickPriceDetail = () => {
    setOpenPriceDetail(true);
  };

  const { data } = useGetRoomsQuery({ variables: { hotelId } });

  return (
    <div data-testid="room-info" className="flex flex-col gap-y-4">
      <h3 className="text-2xl font-semibold">Choose your room</h3>

      <div className="flex w-[223px] rounded-md bg-[#F4F4F5] px-1 py-1">
        <Button className="text-sm font-500 bg-white text-black w-[91px]">All rooms </Button>
        <Button className="text-sm font-500 w-[61px] bg-[#F4F4F5]">1 bed</Button>
        <Button className="text-sm font-500 w-[61px] bg-[#F4F4F5]">2 bed</Button>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-4 px-10">
        {data?.getRooms?.map((rooms) => (
          <div data-testid="room-info-item" key={rooms.id} className="flex flex-col gap-y-4">
            <div className="w-[349px] h-[216px] relative">
              {rooms?.imageURL[0] && <Image data-testid="room-info-item-image" src={rooms.imageURL[0]} alt="roomImage" fill className="object-cover rounded-lg" />}
            </div>

            <div className="px-4 flex flex-col gap-y-4">
              <h3 className="text-base font-bold">{rooms.name}</h3>

              <div className="flex flex-col gap-y-3">
                {rooms.roomInformation.slice(0, 6).map((info, index) => (
                  <div key={index} className="flex items-center gap-x-2 text-sm">
                    {infoIcons[info] && infoIcons[info]}
                    <span className="capitalize">{info.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
              {showMore ? (
                <ShowMore data-testid="show-more-room-modal" open={true} onOpenChange={setShowMore} rooms={rooms} />
              ) : (
                <div data-testid="show-more-room-modal-btn" onClick={handleClickShow} className="flex gap-x-2  py-2  cursor-pointer text-blue-600">
                  <p className="text-sm font-medium">Show more </p>
                  <ChevronRight className="w-4 h-4  mt-[3px] " />
                </div>
              )}
              <div className="border border-solid"></div>
              <div className="flex flex-col gap-y-1">
                <p className="text-xs font-normal text-gray-500">Total</p>
                {rooms.pricePerNight * nights}

                <div className="flex items-center gap-x-1">
                  {rooms.pricePerNight} <p className="text-xs font-normal">Price per night</p>
                </div>

                <div className="flex  justify-between">
                  {openPriceDetail ? (
                    <PriceDetail data-testid="price-detail-button-room-info" open={openPriceDetail} onOpenChange={setOpenPriceDetail} roomId={rooms.id} />
                  ) : (
                    <div data-testid="price-detail-button-room-info" onClick={handleClickPriceDetail} className=" flex gap-x-2 text-blue-600 items-center cursor-pointer">
                      <p className="text-sm font-medium">Price detail</p>
                      <ChevronRight className="w-4 h-4  " />
                    </div>
                  )}

                  <ReserveButton roomId={rooms.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
