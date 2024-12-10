'use-client';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@mui/material';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';
import { Room } from '@/generated';

export const SearchedHotelCards = ({ roomData }: { roomData: Room }) => {
  return (
    <Card data-cy="room-card" className="min-w-[872px] max-h-[250px] mt-5">
      <CardContent className="flex gap-8">
        <Image src="https://via.placeholder.com/150" alt="hotel image" className="flex-1 border border-black h-[222px]" height={60} width={80}></Image>
        <section className="flex-col flex-1 pt-5">
          <div className="text-center md:text-left">
            <header className="text-lg font-semibold">{roomData.hotelId?.hotelName}</header>
            <Rating value={roomData.hotelId?.starRating} />
          </div>
          <section className="flex justify-between mt-14">
            <div className="flex items-end gap-2">
              <Badge className="w-12 h-5 text-center bg-blue-700">{roomData.hotelId?.userRating}</Badge>
              <p>Excellent</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-light text-gray-500">Per night</p>
              <h3 className="text-2xl">150,000₮</h3>
              <p className="text-sm font-light">210,000₮ total</p>
            </div>
          </section>
        </section>
      </CardContent>
    </Card>
  );
};
