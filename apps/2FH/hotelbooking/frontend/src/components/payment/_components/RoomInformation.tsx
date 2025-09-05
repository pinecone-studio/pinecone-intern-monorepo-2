import { RoomInformationSvg } from '@/components/payment/_components/assets/RoomInformationSvg';
import Image from 'next/image';
import { PriceDetail } from './PriceDetail';
import { useHotelByIdForBookingQuery } from '@/generated';
import { NoImage } from './assets/NoImage';
export const RoomInformation = () => {
  const { data } = useHotelByIdForBookingQuery({
    variables: {
      hotelId: '68b7bee57d52b027d4752888',
    },
  });
  const image = data?.hotel.images[0] ?? '/Images/NoImage.png';

  return (
    <div data-testid="Room-Information-Container" className="w-full flex flex-col gap-3">
      <div className={`relative w-full h-[200px] `}>
        {image === '/Images/NoImage.png' ? (
          <div className="w-full h-full flex items-center justify-center border-[1px] rounded-xl">
            <NoImage />
          </div>
        ) : (
          <Image src={`${image}`} fill alt="Picture of the author" className="rounded-xl" />
        )}
      </div>
      <div className="p-[16px] flex flex-col gap-3 border-[1px] border-opacity-50 border-t-0 rounded-xl">
        <div className="flex flex-col gap-3 ">
          <div className="font-semibold">{data?.hotel.name}</div>
          <div className="opacity-50">{data?.hotel.location}</div>
          <div className="flex gap-3">
            <div className="bg-[#2563EB] text-white px-2 rounded-full">{data?.hotel.rating}</div>
            <div>Excellent</div>
          </div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div>
          <div className="opacity-50">Check in</div>
          <div>Monday, Jul 1, 3:00pm</div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div>
          <div className="opacity-50">Check out</div>
          <div>Monday, Jul 1, 3:00pm</div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div className="flex flex-col gap-3">
          <div className="opacity-50">Standart Room, City View</div>
          <div className="flex gap-5 justify-between w-[60%]">
            <div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">1 Queen Bed</div>
              </div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">Breakfast included</div>
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">Non smoking</div>
              </div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">Pet friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[1px] rounded-xl">
        <PriceDetail />
      </div>
    </div>
  );
};
