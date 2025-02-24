'use client';
import { RoomType, useHotelDetailLazyQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import RoomCard from './RoomCard';
import { useEffect, useState } from 'react';
import HotelDetailImage from '@/app/(user)/(public)/hotel-detail/HotelDetailImage';
import { useQueryState } from 'nuqs';

const HotelRooms = ({
  images,
  isOpenImageDialog,
  setIsOpenImageDialog,
  id,
}: {
  id: string;
  isOpenImageDialog: boolean;
  images: (string | null)[];
  setIsOpenImageDialog: (_value: boolean) => void;
}) => {
  const [dateFrom] = useQueryState('dateFrom', {
    defaultValue: '',
  });
  const [dateTo] = useQueryState('dateTo', {
    defaultValue: '',
  });
  const [GetFilteredRooms, { data }] = useHotelDetailLazyQuery({
    variables: {
      hotelId: id,
      input: {
        checkInDate: dateFrom,
        checkOutDate: dateTo,
      },
    },
  });

  const [selected, setSelected] = useState('');
  const cards: RoomType[] = [];
  const imagesArray = [...images];
  data?.hotelDetail.forEach((card) => {
    if (card.roomType?.includes(selected)) {
      cards.push(card);
    }
  });
  data?.hotelDetail.forEach((room) => {
    if (room.images[0]) {
      imagesArray.push(room.images[0]);
    }
  });
  useEffect(() => {
    GetFilteredRooms();
  }, [dateFrom, dateTo]);
  return (
    <div data-cy="Hotel-Rooms" className="flex flex-col flex-1 gap-4">
      <div className="text-2xl font-semibold">Choose your room</div>
      <div className="bg-[#F4F4F5] rounded-lg max-w-56 flex justify-between p-1">
        <Button
          data-cy="All-Rooms-button"
          onClick={() => setSelected('')}
          variant={'ghost'}
          className={`px-3 py-1 text-sm font-medium rounded-sm hover:bg-white ${selected == '' ? 'bg-white ' : 'text-[#71717A]'}`}
        >
          All Rooms
        </Button>
        <Button
          data-cy="one-button"
          onClick={() => setSelected('1bed')}
          variant={'ghost'}
          className={`px-3 py-1 text-sm font-medium rounded-sm hover:bg-white ${selected == '1bed' ? 'bg-white ' : 'text-[#71717A]'}`}
        >
          1 bed
        </Button>
        <Button onClick={() => setSelected('2beds')} variant={'ghost'} className={`px-3 py-1 text-sm font-medium rounded-sm  hover:bg-white ${selected == '2beds' ? 'bg-white ' : 'text-[#71717A]'}`}>
          2 beds
        </Button>
      </div>
      <div data-cy="Room-Card" className="grid justify-center grid-cols-1 gap-4 md:grid-cols-3">
        {cards.slice(0, 5).map((room) => (
          <div key={room._id}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>
      <HotelDetailImage setIsOpenImageDialog={setIsOpenImageDialog} open={isOpenImageDialog} images={imagesArray} />
    </div>
  );
};
export default HotelRooms;
