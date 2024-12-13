'use client';
import HomePageCard from '@/components/HomePageCard';

import { useGetHotelsQuery } from '@/generated';
import Link from 'next/link';

const Page = () => {
  const { data, loading } = useGetHotelsQuery();
  if (loading) return <div>loading...</div>;
  return (
    <div data-cy="Home-Page" className="max-w-[1920px]">
      <div className="container mx-auto">
        <div className="flex justify-between pt-8 pb-4">
          <p data-cy="Popular-Hotels" className="font-semibold text-[24px] texxt-[#09090B]">
            Popular Hotels
          </p>
          <button className="border-2 font-medium text-[14px] text-[#18181B] py-2 px-4 rounded-md">View all</button>
        </div>
        <div className="grid grid-cols-4 rounded-md gap-2">
          {data?.getHotels.map((hotel) => (
            <Link href={`/hotel-detail/${hotel._id}`} key={hotel._id}>
              <HomePageCard hotel={hotel} />
            </Link>
          ))}
        </div>
        <div className="flex justify-between pt-8 pb-4">
          <p className="font-semibold text-[24px] texxt-[#09090B]">Most booked hotels in Mongolia in past month</p>
          <button className="border-2 font-medium text-[14px] text-[#18181B] py-2 px-4 rounded-md">View all</button>
        </div>
        <div className="grid grid-cols-4 rounded-md pb-14">
          <div className="w-[308px] h-[424px] bg-pink-500 rounded-md">1</div>
          <div className="w-[308px] h-[424px] bg-pink-500 rounded-md">2</div>
          <div className="w-[308px] h-[424px] bg-pink-500 rounded-md">3</div>
          <div className="w-[308px] h-[424px] bg-pink-500 rounded-md">4</div>
        </div>
      </div>
    </div>
  );
};
export default Page;
