'use client';

import { HeroBanner } from '@/components/landing-page/HeroBanner';
import { PopularHotels } from '@/components/landing-page/PopularHotels';
import { MostBookedHotels } from '@/components/landing-page/MostBookedHotels';

const Page = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <PopularHotels />
      <MostBookedHotels />
    </div>
  );
};

export default Page;
