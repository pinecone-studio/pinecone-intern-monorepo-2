'use client';
import FooterReserve from '@/components/footer/footer-reserve';
import HomeHeader from '@/components/home-header/Header';
import HotelCard from '@/components/hotel/hotel-card';
const Page = () => {
  return (
    <div className="h-screen w-full ">
      <HomeHeader />
      <HotelCard />
      <FooterReserve></FooterReserve>
    </div>
  );
};

export default Page;
