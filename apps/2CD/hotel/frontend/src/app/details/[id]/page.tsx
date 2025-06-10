'use client';

import { HotelImage } from '@/app/details/_components/HotelImage';
import { useGetHotelByIdQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { HotelDetailsSkeleton } from '../_components/Skeleton';
import { Description } from '../_components/Description';
import Header from '@/components/header/Header';
import FooterReserve from '@/components/footer/footer-reserve';
import { DescriptionHeader } from '../_components/DescriptionHeader';
import { Location } from '../_components/HotelLocation';
import { Contact } from '../_components/Contact';
import { ChooseRoom } from '../_components/ChooseRoom';

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetHotelByIdQuery({
    variables: { getHotelByIdId: id },
  });
  console.log(data);
  if (loading) return <HotelDetailsSkeleton />;
  if (error) return <p>Error loading: {error.message}</p>;
  return (
    <>
      <Header />
      <div className="w-full flex flex-col items-center p-4 mb-10">
        <div className="w-full max-w-[1080px] space-y-6 mb-8">
          <div className="flex gap-4">
            <HotelImage />
          </div>
          {/* Room Info */}
          <DescriptionHeader hotelName={data?.getHotelById.hotelName || ''} />
          <div className="w-full flex justify-between">
            <Description data={data?.getHotelById} hotelStar={data?.getHotelById.hotelStar} />
            <div className="inline-flex flex-col gap-y-4">
              <Location />
              <Contact phoneNumber={data?.getHotelById.phoneNumber} />
            </div>
          </div>
        </div>
        <ChooseRoom />
      </div>

      <FooterReserve />
    </>
  );
};

export default Page;
