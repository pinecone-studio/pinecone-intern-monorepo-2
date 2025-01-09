'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetHotelsQuery } from '@/generated';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { Select } from '@radix-ui/react-select';
import { Star } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import AddHotelGeneralInfo from '../../AddHotelGeneralInfo';
import { useState } from 'react';

const Page = () => {
  const [hotelOpen, setHotelOpen] = useState(false);
  const { data, loading } = useGetHotelsQuery();

  if (loading) return <div>Loading...</div>;
  return (
    <div className="w-full">
      <div className="bg-slate-100 flex">
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
              <Input data-cy="Input-element" placeholder="Search" />
            </div>
            <Select>
              <SelectTrigger className="w-[156px]" data-cy="Room-input">
                <SelectValue placeholder="Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem data-cy="Single" value="Single">
                    Single
                  </SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="President">President</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[156px]" data-cy="Star-rating">
                <SelectValue placeholder="Star Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="one">1 star</SelectItem>
                  <SelectItem value="two">2 star</SelectItem>
                  <SelectItem value="three">3 star</SelectItem>
                  <SelectItem value="four">4 star</SelectItem>
                  <SelectItem value="five">5 star</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[156px]" data-cy="User-rating">
                <SelectValue placeholder="User Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="one">1 Worst</SelectItem>
                  <SelectItem value="two">2 Very Poor</SelectItem>
                  <SelectItem value="three">3 Poor</SelectItem>
                  <SelectItem value="four">4 Not Normal</SelectItem>
                  <SelectItem value="five">5 Normal</SelectItem>
                  <SelectItem value="six">6 Better </SelectItem>
                  <SelectItem value="seven">7 Good</SelectItem>
                  <SelectItem value="eight">8 Very good</SelectItem>
                  <SelectItem value="nine">9 Exellent</SelectItem>
                  <SelectItem value="ten">10 The Best</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="px-4">
            <Table className="bg-white border-2">
              <TableRow className="border-2">
                <TableCell className="border-2 w-[82px]">ID</TableCell>
                <TableCell className="border-2">Name</TableCell>
                <TableCell className="border-2 w-[320px]">Rooms</TableCell>
                <TableCell className="border-2 w-[160px]">Stars Rating</TableCell>
                <TableCell className="border-2 w-[160px]">User Rating</TableCell>
              </TableRow>
              <TableBody>
                {data?.getHotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell className="border-2 w-[82px]">{hotel._id}</TableCell>
                    <TableCell className="border-2 w-[892px]">
                      <Link className="flex items-center gap-2" href={`/admin-hotel-detail/${hotel._id}`}>
                        <div className="w-12 h-12">
                          <Image className="w-full h-full object-cover" src={hotel?.images?.[0] || '/'} alt="image" width={1000} height={1000} />
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
        </div>
      </div>
      <div data-cy="Add-Hotel-General-Info-Dialog">
        <AddHotelGeneralInfo setOpen={setHotelOpen} open={hotelOpen} />
      </div>
    </div>
  );
};
export default Page;
