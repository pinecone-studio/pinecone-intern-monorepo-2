import React from 'react';
import Image from 'next/image';

interface HotelImageProps {
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  hotelRating?: number;
}

export const HotelImage = ({ hotelName, hotelLocation, hotelImage, hotelRating }: HotelImageProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-64 w-full">
        <Image src={hotelImage} alt={hotelName} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{hotelName}</h3>
        <div className="text-gray-600 mb-4">{hotelLocation}</div>
        {hotelRating && (
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {hotelRating} Excellent
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
