import Amenities from '@/components/hotel/amenities-section';
import type { GetHotelByIdQuery } from '@/generated';
import { Star } from 'lucide-react';

type DescriptionProps = {
  data?: GetHotelByIdQuery['getHotelById'];
  hotelStar?: number | null;
};

export const Description = ({ data, hotelStar = 3 }: DescriptionProps) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-300 pb-10">
        {hotelStar && (
          <div className="flex gap-2">
            {Array.from({ length: hotelStar }).map((_, i) => (
              <Star key={i} size={18} fill="#ffb700" stroke="#ffb700" />
            ))}
          </div>
        )}
        <h3 className="text-xl">{data?.description}</h3>
        <p className="w-full flex gap-3 text-[15px]">
          <p className="w-[39px] h-[22px] text-[15px] flex justify-center items-center rounded-full text-white bg-blue-600">10</p> Excellent
        </p>
      </div>
      <p>Most popular facilities</p>
      <div className="flex gap-10">
        <Amenities amenities={data?.amenities as string[]} />
        <div>
          <h4 className="font-medium text-gray-700">Bathroom</h4>
        </div>
      </div>
    </div>
  );
};
