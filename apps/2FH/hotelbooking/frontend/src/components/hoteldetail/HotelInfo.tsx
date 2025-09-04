'use client';

import Image from 'next/image';
import { useHotelQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, CircleParking, Phone } from 'lucide-react';
import { RoomInfo } from './RoomInfo';

// Extract image gallery component
const HotelImageGallery = ({ images }: { images?: (string | null)[] }) => {
  const renderImage = (src: string | null | undefined, alt: string, width: number, height: number, className?: string) => {
    if (!src) return null;
    return <Image alt={alt} width={width} height={height} src={src} className={className} />;
  };

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 ">
      <div className="row-span-2 col-span-2">{renderImage(images?.[0], 'hotel-bar-lounge', 579, 434)}</div>
      <div className="row-span-1 col-span-1">{renderImage(images?.[1], 'hotel-exterior', 286, 214, 'object-cover w-full h-full rounded-lg')}</div>
      <div className="row-span-1 col-span-1">{renderImage(images?.[2], 'hotel-room1', 286, 214, 'object-cover w-full h-full rounded-lg')}</div>
      <div className="row-span-2 col-span-1">{renderImage(images?.[3], 'hotel-room2', 286, 214, 'object-cover w-full h-full rounded-lg')}</div>
      <div className="row-span-2 col-span-1">{renderImage(images?.[4], 'hotel-room3', 286, 214, 'object-cover w-full h-full rounded-lg')}</div>
    </div>
  );
};

// Extract hotel details component
const HotelDetails = ({ hotel }: { hotel: any }) => (
  <div className="flex flex-col gap-y-6">
    <div className="flex flex-col gap-y-2 w-[552px]">
      <h3 className="text-3xl font-semibold">{hotel?.name}</h3>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star data-testid={`Star ${i}`} key={i} className={`w-4 h-4 ${i < (hotel?.stars ?? 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
        ))}
      </div>
      <p className="text-base font-normal ">{hotel?.description}</p>
    </div>
    <div className="flex gap-x-2">
      <Badge className="w-[39px] h-5 rounded-full bg-blue-600">{hotel?.rating}</Badge>
      <p className="text-sm font-medium">Excellent</p>
    </div>
    <div className="border border-solid"></div>
    <div className="flex flex-col gap-y-4">
      <h3 className="text-sm font-bold">Most popular facilities</h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {hotel?.amenities.map((amenity: string) => (
          <div className="flex gap-x-2" key={amenity}>
            <CircleParking className="w-4 h-4" />
            <p className="text-sm font-medium">{amenity}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Extract location and contact component
const LocationAndContact = ({ hotel }: { hotel: any }) => (
  <div className="flex flex-col gap-y-2">
    <h3 className="text-base font-bold">Location</h3>
    <div className="px-4 py-4 ">
      <p className="text-base font-normal">{hotel?.location}</p>
    </div>
    <h3 className="text-base font-bold">Contact</h3>
    <div className="px-4 py-4 flex gap-x-3 items-center">
      <Phone className="h-[20px] w-[20px]" />
      <div className="flex flex-col gap-y-1">
        <p className="text-sm font-medium text-gray-500">Phone Number</p>
        {hotel?.phone}
      </div>
    </div>
  </div>
);

export const HotelInfo = () => {
  const { hotelId } = useParams();
  const { data } = useHotelQuery({
    variables: { hotelId: hotelId as string },
  });

  return (
    <div data-testid="hotel-info" className="w-[1280px] m-auto py-8 px-[60px] flex flex-col gap-y-14 ">
      <div className="flex flex-col gap-8">
        <HotelImageGallery images={data?.hotel?.images} />
        <div className="px-10 flex gap-x-12">
          <HotelDetails hotel={data?.hotel} />
          <LocationAndContact hotel={data?.hotel} />
        </div>
      </div>
      <RoomInfo hotelId={hotelId as string} />
    </div>
  );
};
