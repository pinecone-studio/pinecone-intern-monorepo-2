

import type { GetHotelByIdQuery } from '@/generated';

type DescriptionProps = {
  data?: GetHotelByIdQuery['getHotelById'];
};

export const Description = ({ data }: DescriptionProps) => {
  return (
    <div className="space-y-4 ">
      <h3 className="text-xl font-semibold">{data?.description}</h3>
      <div className="flex gap-10">
     
        <div>
          <h4 className="font-medium text-gray-700">Bathroom</h4>
        </div>
      </div>
    </div>
  );
};
