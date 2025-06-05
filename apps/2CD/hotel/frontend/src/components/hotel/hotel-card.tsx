/* eslint-disable unicorn/filename-case */

'use client';
import React from 'react';
import { PopularHotel } from './popular-hotel';
import { MostBookedHotel } from './most-booked-hotel';
const HotelCard = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5 py-10">
      <PopularHotel />
      <PopularHotel />
      <MostBookedHotel />
    </div>
  );
};

export default HotelCard;
