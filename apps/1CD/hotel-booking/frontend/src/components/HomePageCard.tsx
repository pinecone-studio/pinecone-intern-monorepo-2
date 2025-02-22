import { Card } from '@/components/ui/card';
import { Hotel } from '@/generated';
import { Wifi } from 'lucide-react';
import { Flower } from 'lucide-react';
import { CircleParking } from 'lucide-react';
import { Star } from 'lucide-react';
import Image from 'next/image';

const HomePageCard = ({ hotel }: { hotel: Hotel }) => {
  return (
    <div className="flex justify-center w-full">
      <Card className="max-w-[360px] w-full h-auto border-2 rounded-md md:max-w-[400px] lg:max-w-[500px]">
        <div className="w-full h-[200px] bg-slate-100">{<Image className="object-cover w-full h-full" src={hotel?.images?.[0] || '/'} alt="image" height={1000} width={1000} />}</div>
        <div className="p-4">
          <div className="pb-3">
            <p className="text-lg font-bold md:text-lg">{hotel.hotelName}</p>
            <div className="flex gap-1">
              <Star className="w-[16px] text-[#F97316] fill-[#F97316]" />
              <Star className="w-[16px] text-[#F97316] fill-[#F97316]" />
              <Star className="w-[16px] text-[#F97316] fill-[#F97316]" />
            </div>
          </div>
          <div className="flex gap-1.5 items-center pb-3">
            <Wifi className="w-[16px]" />
            <p className="text-[14px] md:text-[16px]">Free WIFI</p>
          </div>
          <div className="flex gap-1.5 items-center pb-3">
            <Flower className="w-[16px]" />
            <p className="text-[14px] md:text-[16px]">Spa access</p>
          </div>
          <div className="flex gap-1.5 items-center pb-3">
            <CircleParking className="w-[16px]" />
            <p className="text-[14px] md:text-[16px]">Free self parking</p>
          </div>
          <div className="flex gap-1.5 items-center pb-3">
            <div className="bg-blue-700 text-white py-0.5 px-2.5 rounded-full text-[12px] font-semibold md:text-[14px] hover:bg-blue-500">8.6</div>
            <p className="text-[14px] md:text-[16px]">Excellent</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePageCard;
