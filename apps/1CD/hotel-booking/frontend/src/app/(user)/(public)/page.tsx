'use client';

import HomePageCard from '@/components/HomePageCard';
import { Button } from '@/components/ui/button';

import { useGetHotelsQuery } from '@/generated';
import Image from 'next/image';
import Link from 'next/link';

import { useState } from 'react';

const Page = () => {
  const { data, loading } = useGetHotelsQuery();
  const [sliceNum, setSliceNum] = useState<number | undefined>(13);
  if (loading)
    return (
      <div className="flex justify-center">
        <Image src={'/loader.svg'} alt="loader" width={200} height={200} className="w-[200px] h-[200px]" />
      </div>
    );
  return (
    <div data-cy="Home-Page" className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 pb-4 mx-auto max-w-[1400px]">
        <p data-cy="Popular-Hotels" className="font-semibold text-[24px] text-[#09090B]">
          Popular Hotels
        </p>
        <Button variant="outline" className="hover:bg-slate-200 max-w-[356px] w-full sm:max-w-20" data-cy="View-All-Btn" onClick={() => setSliceNum(data?.getHotels.length)}>
          View all
        </Button>
      </div>
      <section className="max-w-[1400px] mx-auto md:mx-auto">
        <div className="grid grid-cols-1 gap-4 rounded-md cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.getHotels.slice(0, sliceNum).map((hotel) => (
            <Link key={hotel._id} href={'/search-result'}>
              <HomePageCard hotel={hotel} />
            </Link>
          ))}
        </div>
        <div className="flex gap-3 pb-4 mt-24 md:justify-between">
          <p className="text-lg font-semibold text-wrap md:text-2xl md:font-semibold">Most booked hotels in Mongolia in past month</p>
          <button className="border-2 font-medium md:text-[14px] text-[#18181B] py-2 px-4 rounded-md cursor-pointer hover:bg-slate-200">View all</button>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-20 rounded-md cursor-pointer sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.getHotels.slice(0, 4).map((hotel) => (
            <Link key={hotel._id} href={'/search-result'}>
              <HomePageCard hotel={hotel} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Page;
