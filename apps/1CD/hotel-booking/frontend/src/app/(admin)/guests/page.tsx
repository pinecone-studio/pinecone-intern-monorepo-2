'use client';
import { Input } from '@/components/ui/input';
import StatusSelect from './_components/Select';
import React, { useEffect, useState } from 'react';
import { useGetBookingsLazyQuery } from '@/generated';
import DataTable from './_components/DataTable';
import { Table, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import Link from 'next/link';

const Page = () => {
  const [getBookings, { data }] = useGetBookingsLazyQuery();
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  let filteredBookings = data?.getBookings;
  if (searchValue) {
    filteredBookings = data?.getBookings.filter((booking) => {
      return `${booking?.userId?.firstName} ${booking?.userId?.lastName}`.toLowerCase()?.includes(searchValue.toLowerCase());
    });
  }

  if (selectedStatus !== 'all') {
    filteredBookings = filteredBookings?.filter((booking) => {
      return booking.status == selectedStatus.toLowerCase();
    });
  }

  useEffect(() => {
    getBookings();
  }, [setSelectedStatus, getBookings, data?.getBookings]);

  return (
    <section data-cy="Get-Bookings-Page" className="w-full h-full bg-blue-50">
      <section data-cy="Bookings-Data-Table" className="flex flex-col gap-6 p-5 border-t-[2px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-[24px] text-[#2563EB] font-bold pl-1">Guests</h2>
          <div className="flex gap-3" data-cy="Bookings-Filters">
            <Input className="w-full bg-white" data-cy="Bookings-Search-Input" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
            <StatusSelect setSelectedStatus={setSelectedStatus} />
          </div>
        </div>
        <Table className="w-full bg-white" data-cy="Bookings-Data">
          <TableHeader className="rounded-xl">
            <TableRow className="flex items-center gap-4 border">
              <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">ID</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Name</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Hotel</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Rooms</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guests</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9 font-semibold text-black">Date</TableHead>
              <TableHead className="flex items-center flex-1 w-40 h-8 font-semibold text-black">Status</TableHead>
            </TableRow>
          </TableHeader>

          {filteredBookings?.map((bookingsData) => (
            <Link key={bookingsData._id} href={`/guests/info/${bookingsData._id}`}>
              <DataTable bookingsData={bookingsData} />
            </Link>
          ))}
        </Table>
      </section>
    </section>
  );
};

export default Page;
