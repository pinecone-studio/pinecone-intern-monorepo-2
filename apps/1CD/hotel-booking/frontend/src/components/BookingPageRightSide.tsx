import { Zap } from 'lucide-react';
import Image from 'next/image';

export const BookingPageRightSide = () => {
  return (
    <div data-testid="Booking-Right-Side" className="max-w-[515px] w-full">
      <div className="w-full h-auto">
        <Image src={'/images/cards-cc_visa.png'} className="object-cover w-full h-full rounded-t-[8px] bg-slate-500" width={1000} height={1000} alt="image" />
      </div>

      <div className="p-4 text-[#09090B] border rounded-b-[8px] mb-6">
        <div className="mb-1 text-lg font-bold">Flower Hotel Ulaanbaatar</div>
        <div className="text-sm mb-4 text-[#71717A]">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-[#2563EB] w-[39px] h-[20px] text-center text-[#FAFAFA] rounded-full">8.6</div>
          <div>Excellent</div>
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="text-[#71717A]">Check in</div>
          <div className="">Monday, Jul 1, 3:00pm</div>
        </div>
        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="text-[#71717A]">Check out</div>
          <div className="">Monday, Jul 1, 3:00pm</div>
        </div>
        <div className="h-[1px] w-full my-6 bg-[#E4E4E7]"></div>
        <div className="mb-4 text-sm">Standard Room, City View</div>
        <div className="flex gap-[56px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>1 Queen Bed</div>
            </div>
            <div className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>Breakfast included</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>Non Smoking</div>
            </div>
            <div className="flex items-center gap-2">
              <Zap width={16} height={16} />
              <div>Pet friendly</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-[8px] gap-2 border p-4 text-[#09090B]">
        <div className="text-lg font-bold">Price Detail</div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <div>1 room x 1 night</div>
            <div className="text-[#71717A]">$78.30 per night</div>
          </div>
          <div className="">USD 81.00</div>
        </div>
        <div className="py-4 h-[1px] w-full"></div>
        <div className="flex justify-between">
          <div className="text-sm">Total price</div>
          <div className="text-lg font-bold">USD 81.00</div>
        </div>
      </div>
    </div>
  );
};
