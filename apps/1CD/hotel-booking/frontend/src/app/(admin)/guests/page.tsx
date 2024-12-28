'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { Input } from '@/components/ui/input';

import StatusSelect from './_components/Select';
import React, { useEffect, useState } from 'react';
import { useGetBookingsLazyQuery } from '@/generated';
import DataTable from './_components/DataTable';
import BreadCrumb from './_components/BreadCrumb';
import { Table, TableHeader, TableHead, TableRow } from '@/components/ui/table';

const Page = () => {
  const [getBookings, { data }] = useGetBookingsLazyQuery();
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredBookings = data?.getBookings.filter((booking) => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = booking.userId?.firstName?.toLowerCase().includes(searchValue.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    getBookings();
  }, [setSelectedStatus, getBookings]);
  console.log('BookingsData', data?.getBookings);
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
            <Input className="max-w-[1400px] bg-white" data-cy="Bookings-Search-Input" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
            <StatusSelect setSelectedStatus={setSelectedStatus} />
          </div>
        </div>
        <Table className="max-w-[1600px] bg-white" data-cy="Bookings-Data">
          <TableHeader className="rounded-xl">
            <TableRow className="flex items-center gap-4 border">
              <TableHead className="flex items-center h-6 pl-5 font-semibold text-black border-r-[1px] w-28">ID</TableHead>
              <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Name</TableHead>
              <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Hotel</TableHead>
              <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Rooms</TableHead>
              <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Guests</TableHead>
              <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Date</TableHead>
              <TableHead className="flex items-center w-40 h-8 font-semibold text-black">Status</TableHead>
            </TableRow>
          </TableHeader>
          {filteredBookings?.map((bookingsData) => (
            <DataTable key={bookingsData._id} bookingsData={bookingsData} />
          ))}
        </Table>
      </section>
    </section>
  );
};

export default Page;
