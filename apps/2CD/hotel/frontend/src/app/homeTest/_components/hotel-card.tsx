/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable complexity */

"use client"
import React from 'react';
import { useGetAllHotelsQuery } from '@/generated';
import {Wifi,Star, Sparkles, ParkingCircle} from'lucide-react'
const HotelCard = () => {
  const { data, loading, error } = useGetAllHotelsQuery();
console.log(data);

  if (loading) return <p>Loading hotels...</p>;
  if (error) return <p>Error loading: {error.message}</p>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {data?.getAllHotels?.map((hotel) => (
        <div key={hotel.id} className="rounded-xl overflow-hidden shadow-md border bg-white">
     
            <img
              alt={hotel.hotelName}
              className="w-full h-48 object-cover"
            />
          <div className="p-4">
            <h2 className="text-xl font-bold">{hotel.hotelName ?? 'Unnamed Hotel'}</h2>
            <div className="flex items-center space-x-1 text-yellow-500 my-1">
              {Array.from({ length: hotel.hotelStar ?? 3 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <div className="space-y-1 my-3 text-gray-700">
              {hotel.amenities?.includes("Free Wi-Fi") && (
                <p className="flex items-center gap-2"><Wifi size={16} /> Free WiFi</p>
              )}
              {hotel.amenities?.includes("Spa") && (
                <p className="flex items-center gap-2"><Sparkles size={16} /> Spa access</p>
              )}
              {hotel.amenities?.includes("Gym") && (
                <p className="flex items-center gap-2"><ParkingCircle size={16} /> Free self parking</p>
              )}
            </div>

            {hotel.rating && (
              <div className="flex items-center mt-4">
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-md font-semibold">
                  {hotel.rating}
                </span>
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  {hotel.rating >= 8 ? 'Excellent' : hotel.rating >= 6 ? 'Good' : 'Average'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelCard;
