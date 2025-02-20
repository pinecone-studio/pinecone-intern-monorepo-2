import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@mui/material';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';
import { Hotel } from '@/generated';
import { HotelReveiwRating } from '../BookingDetailRightSide';

export const SearchedHotelCards = ({ hotelData }: { hotelData: Hotel }) => {
  return (
    <Card data-cy="room-card" className="max-w-[872px] w-full mt-4">
      <CardContent className="flex flex-col p-0 md:flex-row">
        <Image src={hotelData.images?.[0] || '/'} alt="hotel image" className="flex-1 w-full max-h-[230px] border-black object-cover rounded-l-md" height={1000} width={1000} />
        <section className="flex-col items-end flex-1 p-5 rounded-r-md">
          <div className="flex-1 text-center md:text-left">
            <header className="text-lg font-semibold">{hotelData?.hotelName}</header>
            <Rating value={hotelData.starRating} />
          </div>
          <section className="flex justify-between mt-14">
            <div className="flex items-end gap-2">
              <Badge className="px-4 text-center bg-blue-700">{hotelData.userRating}</Badge>
              <HotelReveiwRating userRating={hotelData.userRating} />
            </div>
            {hotelData.roomsAveragePrice && (
              <div className="flex flex-col items-end">
                <p className="font-light text-gray-500">Per night</p>
                <h3 className="text-2xl text-black">{hotelData.roomsAveragePrice.toLocaleString()}</h3>
                <p className="text-sm font-light">{(hotelData.roomsAveragePrice + 50000).toLocaleString('en-US')} total</p>
              </div>
            )}
          </section>
        </section>
      </CardContent>
    </Card>
  );
};
