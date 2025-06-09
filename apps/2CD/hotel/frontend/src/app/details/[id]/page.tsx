'use client';

import { HotelImage } from '@/app/details/_components/HotelImage';
import { useGetHotelByIdQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { HotelDetailsSkeleton } from '../_components/Skeleton';
import { Description } from '../_components/Description';
import Header from '@/components/header/Header';
import { PriceDetail } from '../_components/PriceDetail';
import { Location } from '../_components/HotelLocation';
import FooterReserve from '@/components/footer/footer-reserve';
import { HotelHeader } from '../_components/HotelHeader';

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetHotelByIdQuery({
    variables: { getHotelByIdId: id },
  });
  if (loading) return <HotelDetailsSkeleton />;
  if (error) return <p>Error loading: {error.message}</p>;
  return (
    <>
      <Header />
      <div className="w-full flex flex-col items-center p-4 mb-10">
        <div className="w-full max-w-[1080px] space-y-6">
          <HotelHeader hotelName={data?.getHotelById.hotelName || ''} hotelStar={data?.getHotelById.hotelStar} />
          <div className="flex gap-4">
            <HotelImage />
            <div className="w-[400px] inline-flex flex-col gap-4">
              <PriceDetail data={data?.getHotelById} />
              <Location />
            </div>
          </div>
          {/* Room Info */}
          <Description data={data?.getHotelById} />
        </div>
      </div>
      <FooterReserve />
    </>
  );
};

export default Page;
