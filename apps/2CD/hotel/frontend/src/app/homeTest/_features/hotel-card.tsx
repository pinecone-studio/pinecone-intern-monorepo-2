/* eslint-disable unicorn/filename-case */

'use client';
import React from 'react';
import Header from '@/components/header/Header';
import FooterReserve from '@/components/footer/footer-reserve';
import { PopularHotel } from '../_components/popular-hotel';
const HotelCard = () => {
  return (
    <>
      <Header />
      <div className="w-full flex flex-col justify-center items-center gap-5 py-10">
        <PopularHotel />
      </div>
      <FooterReserve />
    </>
  );
};

export default HotelCard;
