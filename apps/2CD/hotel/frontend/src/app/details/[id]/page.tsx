'use client';

import { HotelImage } from '@/app/details/_components/HotelImage';
import { useGetHotelByIdQuery } from '@/generated';
import { SignedIn } from '@clerk/nextjs';
import { Heart, Share, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { HotelDetailsSkeleton } from '../_components/Skeleton';
import { Description } from '../_components/Description';
import Header from '@/components/header/Header';
import FooterCheckIn from '@/components/footer/footer-check-in';
import { PriceDetail } from '../_components/PriceDetail';
import { Location } from '../_components/HotelLocation';

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
    <Header/>
    <div className="w-full flex flex-col items-center p-4">
      <SignedIn>
        <div className="w-full max-w-[1080px] space-y-6">
          {/* Header */}
          <header className="flex justify-between items-center">
            <div className=" items-center gap-2">
              <h2 className="text-2xl font-bold">{data?.getHotelById.hotelName}</h2>
              <div className="flex gap-2">
                {Array.from({ length: data?.getHotelById.hotelStar ?? 3 }).map((_, i) => (
                  <Star key={i} size={18} fill="#ffb700" stroke="#ffb700" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Heart className="cursor-pointer" />
              <Share className="cursor-pointer" />
            </div>
          </header>
          <div className='flex gap-4'>
          <HotelImage />
          <div className='w-[400px] inline-flex flex-col gap-4'>
          <PriceDetail data={data?.getHotelById}/>
          <Location/>
          </div>
          </div>
          {/* Room Info */}
          <Description data={data?.getHotelById} />
        </div>
      </SignedIn>
    </div>
    <FooterCheckIn/>
    </>
  );
};

export default Page;
