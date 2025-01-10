'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Hotel, useGetHotelsLazyQuery } from '@/generated';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { Select } from '@radix-ui/react-select';
import { Star } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import StatusLocation from './_components/SelectLocation';
import SelectRooms from './_components/SelectRooms';
import SelectStarRating from './_components/SelectStarRating';
import SelectUserRating from './_components/SelectUserRating';
import AddHotelGeneralInfo from '../../AddHotelGeneralInfo';

const Page = () => {
  const [searchValue, setSearchValue] = useState('');
  const [hotelOpen, setHotelOpen] = useState(false);
  const [getHotels, { data, loading }] = useGetHotelsLazyQuery();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectRooms, setSelectRooms] = useState('');
  const [selectStarRating, setSelectStarRating] = useState(0);
  const [selectUserRating, setSelectUserRating] = useState(0);

  useEffect(() => {
    getHotels({
      variables: {
        input: {
          hotelName: searchValue,
          starRating: selectStarRating,
          userRating: selectUserRating,
          roomType: selectRooms,
        },
      },
    });
  }, [searchValue, selectStarRating, selectRooms, selectUserRating]);

  const hotels: Hotel[] = [];

  if (selectedStatus) {
    data?.getHotels.forEach((hotel) => {
      if (hotel.location?.toLowerCase().includes(selectedStatus.toLowerCase())) {
        hotels.push(hotel);
        console.log(hotels);
      }
    });
  } else {
    data?.getHotels.forEach((hotel) => {
      hotels.push(hotel);
    });
  }

  return (
    <div className="w-full">
      <div className="flex bg-slate-100">
        <div className="bg-[#F4F4F5] h-full">
          <div className="flex items-center gap-2 px-4 py-5">
            <SidebarTrigger />
            <div data-cy="Hotel-Text" className="font-normal text-sm text-[#020617]">
              Hotels
            </div>
          </div>
          <div>
            <div className="flex justify-between px-4 pt-5">
              <div className="text-[24px] text-[#020617] font-bold">Hotels</div>
              <Button data-cy="Add-Hotel-button" onClick={() => setHotelOpen(true)} className="bg-[#2563EB] rounded-md py-2 px-8 gap-3">
                <p>+</p>
                <p>Add Hotel</p>
              </Button>
            </div>
          </div>
          <div className="flex w-full gap-1 px-4 py-3">
            <div className="flex-1">
              <Input value={searchValue} data-cy="Input-Element" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
            </div>
            <Select>
              <StatusLocation data-cy="Locatiion-input" setSelectedStatus={setSelectedStatus} />
              <SelectRooms setSelectRooms={setSelectRooms} />
              <SelectStarRating setSelectStarRating={setSelectStarRating} />
              <SelectUserRating setSelectUserRating={setSelectUserRating} />
            </Select>
          </div>
          {loading ? (
            <div>Loading</div>
          ) : (
            <div className="px-4">
              <Table className="bg-white border-2">
                <TableBody>
                  <TableRow className="border-2">
                    <TableCell className="border-2 w-[82px]">ID</TableCell>
                    <TableCell className="border-2">Name</TableCell>
                    <TableCell className="border-2 w-[320px]">Rooms</TableCell>
                    <TableCell className="border-2 w-[160px]">Stars Rating</TableCell>
                    <TableCell className="border-2 w-[160px]">User Rating</TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  {hotels?.map((hotel) => (
                    <TableRow key={hotel._id}>
                      <TableCell className="border-2 w-[82px]">{hotel._id?.slice(5, 8)}</TableCell>
                      <TableCell className="border-2 w-[892px]">
                        <Link data-cy="hotel-info" className="flex items-center gap-2" href={`/admin-hotel-detail/${hotel._id}`}>
                          <div className="w-12 h-12">
                            <Image className="object-cover w-full h-full" src={hotel?.images?.[0] || '/'} alt="image" width={1000} height={1000} />
                          </div>
                          {hotel.hotelName}
                        </Link>
                      </TableCell>
                      <TableCell className="border-2 w-[160px]">{hotel.description}</TableCell>
                      <TableCell className="border-2 w-[160px]">
                        <div className="flex items-center gap-2">
                          <Star className="w-[18px]" />
                          {hotel.starRating}
                        </div>
                      </TableCell>
                      <TableCell className="border-2 w-[160px]">
                        <span>{hotel.userRating}</span>
                        <span className="text-[#71717A]">/10</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <div data-cy="Add-Hotel-General-Info-Dialog">
        <AddHotelGeneralInfo setOpen={setHotelOpen} open={hotelOpen} />
      </div>
    </div>
  );
};
export default Page;
