'use client';
import { AirVent, Cat, CigaretteOff, DumbbellIcon, HardHat, Martini, ParkingCircle, PhoneCall, Utensils } from 'lucide-react';
import HotelRooms from './HotelRooms';
import { useGetHotelQuery } from '@/generated';
import Image from 'next/image';
import HotelImportant from '@/components/HotelImportant';
import HotelPolicies from '@/components/HotelPolicies';
import HotelAbout from './HotelAbout';
import HotelAsked from './HotelAsked';
import { HotelReveiwRating } from '@/components/BookingDetailRightSide';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const Services = [
  <>
    <ParkingCircle className="w-4 h-4" />
    <p className="text-sm font-medium">Parking available</p>
  </>,
  <>
    <HardHat className="w-4 h-4" />
    <p className="text-sm font-medium">24/7 front desk</p>
  </>,
  <>
    <AirVent className="w-4 h-4" />
    <p className="text-sm font-medium">Air conditioning</p>
  </>,
  <>
    <DumbbellIcon className="w-4 h-4" />
    <p className="text-sm font-medium">Gym</p>
  </>,
  <>
    <Cat className="w-4 h-4" />
    <p className="text-sm font-medium">Pet-friendly</p>
  </>,
  <>
    <CigaretteOff className="w-4 h-4" />
    <p className="text-sm font-medium">Non-smoking</p>
  </>,
  <>
    <Martini className="w-4 h-4" />
    <p className="text-sm font-medium">Bar</p>
  </>,
  <>
    <Utensils className="w-4 h-4" />
    <p className="text-sm font-medium">Restraurant</p>
  </>,
  <>
    <ParkingCircle className="w-4 h-4" />
    <p className="text-sm font-medium">Laundry</p>
  </>,
];

const HotelDetail = ({ id }: { id: string }) => {
  const [isOpenImageDialog, setIsOpenImageDialog] = useState(false);
  const { data, loading } = useGetHotelQuery({
    variables: {
      id: id,
    },
  });
  const images: string[] = [];
  data?.getHotel?.images?.forEach((image) => {
    if (image) {
      images.push(image);
    }
  });

  if (loading) return <div>loading...</div>;

  return (
    <div data-cy="Hotel-Detail-Page" className="container flex flex-col items-center gap-8 mx-auto">
      <div data-cy="image-open-dialog-button" onClick={() => setIsOpenImageDialog(true)} className="grid grid-cols-4 gap-2">
        {data?.getHotel?.images?.length &&
          data.getHotel.images
            .slice(0, 4)
            .map((image, index) => <Image key={index} src={`${image}`} alt="hotel image" width={580} height={433} className={`${index == 0 && 'col-span-2'} object-cover w-full h-full rounded-sm`} />)}
      </div>
      <div className="px-10 flex flex-col items-center max-w-[1160px] gap-14">
        <div className="flex gap-14">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-col gap-6">
              <div>
                <div className="text-3xl font-semibold">{data?.getHotel.hotelName}</div>
                <div className="text-base font-normal">{data?.getHotel.description}</div>
              </div>
              <div className="flex gap-2">
                <Badge className="px-4 hover:bg-[#2563EB] bg-[#2563EB]">{data?.getHotel.userRating}</Badge>
                <HotelReveiwRating userRating={data?.getHotel.userRating} />
              </div>
            </div>
            <div className="w-full border border-solid 1px bg-[#E4E4E7]"></div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold">Most popular facilities</div>
              <div className="grid grid-cols-3 col-span-3 gap-4">
                {Services.map((item, index) => (
                  <div key={`services${index}`} className="flex items-center gap-1">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <div className="text-base font-bold">Location</div>
            <div className="p-4 border border-solid 1px">
              <div>Damdinbazar street-52, Bayangol district, Bayangol, 212513 Ulaanbaatar, Mongolia</div>
            </div>
            <div>
              <div className="text-base font-bold">Contact</div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium text-[#71717A]">phonenumber</p>
                  <div>{data?.getHotel.phoneNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-14">
          <HotelRooms setIsOpenImageDialog={setIsOpenImageDialog} isOpenImageDialog={isOpenImageDialog} images={images} id={id} />
          <div className="flex flex-col gap-20"></div>
          <HotelAbout hotel={data?.getHotel} />
          <div className="w-full border border-solid 1px bg-[#E4E4E7]"></div>
          <HotelPolicies />
          <div className="w-full border border-solid 1px bg-[#E4E4E7]"></div>
          <HotelImportant />
          <div className="w-full border border-solid 1px bg-[#E4E4E7]"></div>
          <HotelAsked hotel={data?.getHotel} />
        </div>
      </div>
    </div>
  );
};
export default HotelDetail;
