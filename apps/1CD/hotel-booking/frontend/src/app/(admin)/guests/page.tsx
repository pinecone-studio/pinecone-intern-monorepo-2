'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { Input } from '@/components/ui/input';

import StatusSelect from './_components/Select';
import React, { useState } from 'react';
import { useGetBookingsQuery } from '@/generated';
import DataTable from './_components/DataTable';
import BreadCrumb from './_components/BreadCrumb';

const Page = () => {
  const { data } = useGetBookingsQuery();
  const [searchValue, setSearchValue] = useState('');
  const bookings = data?.getBookings;
  const filteredBookings = bookings?.filter((bdata) => {
    bdata.userId?.firstName?.toLocaleLowerCase().includes(searchValue.toLowerCase());
  });
  console.log('filtered bookings', filteredBookings);
  console.log('data', bookings);
  return (
    <section data-cy="Get-Bookings-Page" className="w-screen bg-gray-50">
      <div className="flex items-center gap-2 my-6 ml-5">
        <SidebarTrigger />
        <BreadCrumb />
      </div>
      <section data-cy="Bookings-Data-Table" className="flex flex-col gap-6 p-5 border-t-[2px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Guests</h2>
          <div className="flex gap-3" data-cy="Bookings-Filters">
            <Input className="max-w-[1400px] bg-white" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
            <StatusSelect data-cy="Status-Filter-Modal" />
          </div>
        </div>
        {data?.getBookings.map((bookingsData) => (
          <DataTable key={bookingsData._id} bookingsData={bookingsData} />
        ))}
      </section>
    </section>
  );
};

export default Page;
