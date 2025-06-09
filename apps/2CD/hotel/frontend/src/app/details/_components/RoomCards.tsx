import Amenities from '@/components/hotel/amenities-section';
import { GetRoomForIdQuery } from '@/generated';
import { IconRight } from 'react-day-picker';
import { RoomPrice } from './RoomPrice';

interface roomCardProps {
  room?: GetRoomForIdQuery['getAllRooms'][0];
}
export const RoomCard = ({ room }: roomCardProps) => {
  const amenities = ['Wi-Fi', 'Pool', 'Spa', 'Gym'];
  return (
    <div className="w-[349.33px] h-[689px] rounded-sm overflow-hidden border">
      <div className="w-full h-[216px]">
        <img className="w-full h-[216px]" src={room?.roomImage[0]} alt="room.img" />
      </div>
      <div className="p-4 h-[473px]">
        <div className="inline-flex flex-col gap-y-6 w-full h-[324px] border-b">
          <h2 className="font-bold">{room?.description}</h2>
          <Amenities amenities={amenities} />
          <p className="text-[#2563EB] flex justify-start items-center gap-2">
            show more <IconRight className=" text-[20px]" />{' '}
          </p>
        </div>
        <div>
          <RoomPrice price={room?.price} />
        </div>
      </div>
    </div>
  );
};
