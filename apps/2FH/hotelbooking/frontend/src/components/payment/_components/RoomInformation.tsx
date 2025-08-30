import { RoomInformationSvg } from '@/components/payment/_components/assets/RoomInformationSvg';
import Image from 'next/image';
import { PriceDetail } from './PriceDetail';
export const RoomInformation = () => {
  return (
    <div data-testid="Room-Information-Container" className="w-full flex flex-col gap-3">
      <div className="relative w-full h-[200px]">
        <Image src="/images/Hotel-Image.png" fill alt="Picture of the author" className="rounded-xl" />
      </div>
      <div className="p-[16px] flex flex-col gap-3 border-[1px] border-opacity-50 border-t-0 rounded-xl">
        <div className="flex flex-col gap-3 ">
          <div className="font-semibold">Hotel Ulaanbaatar</div>
          <div className="opacity-50">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</div>
          <div className="flex gap-3">
            <div className="bg-[#2563EB] text-white px-2 rounded-full">8.6</div>
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
