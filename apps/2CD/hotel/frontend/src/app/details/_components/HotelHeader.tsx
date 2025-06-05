'use client';

import { Heart, Share, Star } from 'lucide-react';

interface HotelHeaderProps {
  hotelName: string;
  hotelStar?: number | null;
}

export const HotelHeader = ({ hotelName, hotelStar = 3 }: HotelHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="items-center gap-2">
        <h2 className="text-2xl font-bold">{hotelName}</h2>
        {hotelStar && (
          <div className="flex gap-2">
            {Array.from({ length: hotelStar }).map((_, i) => (
              <Star key={i} size={18} fill="#ffb700" stroke="#ffb700" />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Heart className="cursor-pointer" />
        <Share className="cursor-pointer" />
      </div>
    </div>
  );
};
