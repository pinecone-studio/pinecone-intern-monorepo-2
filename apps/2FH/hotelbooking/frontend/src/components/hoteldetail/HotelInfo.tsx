'use client';

import Image from 'next/image';
import { Amenity, useHotelQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, CircleParking, Phone } from 'lucide-react';
import { RoomInfo } from './RoomInfo';

export const HotelInfo = () => {
  const { hotelId } = useParams();

  const { data } = useHotelQuery({
    variables: { hotelId: hotelId as string },
  });

  return (
    <div className="w-[1280px] m-auto py-8 px-[60px] flex flex-col gap-y-14 ">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 ">
          <div className="row-span-2 col-span-2">
            <Image alt="hotel-bar-lounge" width={579} height={434} src={data?.hotel?.images[0] ?? ''} className="object-cover w-full h-full rounded-lg" />
          </div>

          <div className="row-span-1 col-span-1">
            <Image alt="hotel-exterior" width={286} height={214} src={data?.hotel?.images[1] ?? ''} className="object-cover w-full h-full rounded-lg" />
          </div>

          <div className="row-span-1 col-span-1">
            <Image alt="hotel-room" width={286} height={214} src={data?.hotel?.images[2] ?? ''} className="object-cover w-full h-full rounded-lg" />
          </div>

          <div className="row-span-2 col-span-1">
            <Image alt="hotel-room" width={286} height={214} src={data?.hotel?.images[3] ?? ''} className="object-cover w-full h-full rounded-lg" />
          </div>

          <div className="row-span-2 col-span-1">
            <Image alt="hotel-room" width={286} height={214} src={data?.hotel?.images[4] ?? ''} className="object-cover w-full h-full rounded-lg" />
          </div>
        </div>

        <div className="px-10 flex gap-x-12">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2 w-[552px]">
              <h3 className="text-3xl font-semibold">{data?.hotel?.name}</h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star data-testid={`Star ${i}`} key={i} className={`w-4 h-4 ${i < (data?.hotel?.stars ?? 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                ))}
              </div>

              <p className="text-base font-normal ">{data?.hotel?.description}</p>
            </div>
            <div className="flex gap-x-2">
              <Badge className="w-[39px] h-5 rounded-full bg-blue-600">{data?.hotel?.rating}</Badge>
              <p className="text-sm font-medium">Excellent</p>
            </div>
            <div className="border border-solid"></div>

            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-bold">Most popular facilities</h3>
              <div className="grid grid-cols-3 grid-rows-3 gap-4">
                {data?.hotel?.amenities.map((amenity) => (
                  <div className="flex gap-x-2">
                    <CircleParking className="w-4 h-4" />
                    <p className="text-sm font-medium">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <h3 className="text-base font-bold">Location</h3>
            <div className="px-4 py-4 ">
              <p className="text-base font-normal">{data?.hotel?.location}</p>
            </div>
            <h3 className="text-base font-bold">Contact</h3>
            <div className="px-4 py-4 flex gap-x-3 items-center">
              <Phone className="h-[20px] w-[20px]" />
              <div className="flex flex-col gap-y-1">
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                {data?.hotel?.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoomInfo hotelId={hotelId as string} />
    </div>
  );
};
