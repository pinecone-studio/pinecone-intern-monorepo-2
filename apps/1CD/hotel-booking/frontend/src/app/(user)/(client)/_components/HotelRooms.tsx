'use client';
import { RoomType, useHotelDetailQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import RoomCard from '../../(public)/hotel-detail/RoomCard';
import { useState } from 'react';

const HotelRooms = ({id}:{id:string}) => {
  const { data } = useHotelDetailQuery({ variables: { hotelId: id } });
  const [selected, setSelected] = useState('');
  const cards: RoomType[] = [];
  data?.hotelDetail.forEach((card) => {
    if (card.roomType?.includes(selected)) {
      cards.push(card);
    }
  });
  return (
    <div data-cy="Hotel-Rooms" className="flex flex-col gap-4">
      <div className="text-2xl font-semibold">Choose your room</div>
      <div className="bg-[#F4F4F5] rounded-lg max-w-56 flex justify-between p-1">
        <Button data-cy="All-Rooms-button"
          onClick={() => setSelected('')}
          variant={'ghost'}
          className={`px-3 py-1 text-sm font-medium rounded-sm hover:bg-white ${selected == '' ? 'bg-white ' : 'text-[#71717A]'}`}
        >
          All Rooms
        </Button>
        <Button data-cy="one-button" onClick={() => setSelected('1bed')} variant={'ghost'} className={`px-3 py-1 text-sm font-medium rounded-sm hover:bg-white ${selected == '1bed' ? 'bg-white ' : 'text-[#71717A]'}`}>
          1 bed
        </Button>
        <Button onClick={() => setSelected('2beds')} variant={'ghost'} className={`px-3 py-1 text-sm font-medium rounded-sm  hover:bg-white ${selected == '2beds' ? 'bg-white ' : 'text-[#71717A]'}`}>
          2 beds
        </Button>
      </div>
      <div data-cy="Room-Card" className="grid grid-cols-3 gap-4">
        {cards.slice(0, 5).map((room) => (
          <div key={room._id}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default HotelRooms;
