/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
'use client ';

import { useMostBookedHotelQuery } from '@/generated';
import { Star } from 'lucide-react';
import Amenities from './amenities-section';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export const MostBookedHotel = () => {
  const { data, loading, error } = useMostBookedHotelQuery();
  console.log(data);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center gap-6 flex-col">
        <div className="w-[1280px]">
          <Skeleton className="w-48 h-10" />
        </div>
        <div className="w-[1280px] flex justify-center items-center gap-6">
          <Skeleton className="w-[310px] h-96" />
          <Skeleton className="w-[310px] h-96" />
          <Skeleton className="w-[310px] h-96" />
          <Skeleton className="w-[310px] h-96" />
        </div>
      </div>
    );
  if (error) return <p>Error loading: {error.message}</p>;

  return (
    <>
      <div className="w-[1280px] flex justify-between">
        <p className="font-bold text-2xl">Most Booked Hotel</p>
        <Button variant="outline">View all</Button>
      </div>
      <div className="w-[1280px] grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.mostBookedHotel?.map((hotel) => (
          <div key={hotel.hotel.hotelName} className="rounded-xl overflow-hidden shadow-md border bg-white">
            <img alt={hotel.hotel.hotelName} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold">{hotel.hotel.hotelName ?? 'Unnamed Hotel'}</h2>
              <div className="flex items-center space-x-1 text-yellow-500 my-1">
                {Array.from({ length: hotel.hotel.hotelStar ?? 3 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <div className="space-y-1 my-3 text-gray-700">
                <Amenities amenities={hotel.hotel.amenities ?? []} />
              </div>
              {hotel.bookingCount && (
                <div className="flex items-center mt-4">
                  <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-md font-semibold">{hotel.bookingCount}</span>
                  <span className="ml-2 text-sm text-gray-700 font-medium">Booking count</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
