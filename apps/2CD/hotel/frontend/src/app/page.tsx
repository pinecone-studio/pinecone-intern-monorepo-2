/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable complexity */
'use client';
import Header from '@/components/header/Header';
import FooterReserve from '@/components/footer/footer-reserve';
import HotelCard from '@/components/hotel/hotel-card';
const Page = () => {
  return (
    <div className="h-screen w-full ">
      <Header></Header>
      <HotelCard />
      <FooterReserve></FooterReserve>
    </div>
  );
};

export default Page;
