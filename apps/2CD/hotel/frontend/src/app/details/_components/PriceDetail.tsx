import { GetHotelByIdQuery } from '@/generated';

type DescriptionProps = {
  data?: GetHotelByIdQuery['getHotelById'];
};
export const PriceDetail = ({ data }: DescriptionProps) => {
  return (
    <div className="w-[400px] h-fit rounded-2xl border-gray-200 border p-5 inline-flex flex-col gap-3 shadow-md">
      <h1 className="text-xl">Price Detail</h1>
      <div className='inline-flex flex-col gap-4'>
        <div className="flex justify-between  pb-4 border-b border-b-gray-200">
          <div className="font-thin">
            <p>1 night</p>
            <p className=" text-gray-400">{data?.price}&#x20AE; per night</p>
          </div>
          <div>{data?.price}&#x20AE;</div>
        </div>
        <div className="flex justify-between">
          {' '}
          <p>Totoal price</p> <p>....</p>
        </div>
        <button className="bg-blue-600 w-full h-8 rounded-sm text-white font-thin">Reserve</button>
      </div>
    </div>
  );
};
