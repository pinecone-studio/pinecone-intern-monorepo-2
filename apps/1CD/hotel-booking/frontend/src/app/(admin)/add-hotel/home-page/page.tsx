'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetHotelsQuery } from '@/generated';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { Select } from '@radix-ui/react-select';
import { Zap } from 'lucide-react';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Star } from 'lucide-react';
const Page = () => {
  const { data, loading } = useGetHotelsQuery();
  if (loading) return <div>Loading...</div>;
  return (
    <div data-cy="home-page-div" className="max-w-[1920px] container mx-auto">
      <div className="container max-w-[1640px] bg-slate-100 flex">
        <div className="bg-yellow-100 w-[240px] h-[948px]">
          <div className="flex gap-2 items-center pl-2 py-2.5">
            <div className="w-[32px] h-[32px] bg-[#2563EB] rounded-lg flex items-center justify-center">
              <div className="bg-white rounded-full w-[16px] h-[16px]"></div>
            </div>
            <div>
              <p className="text-[#334155] text-[14px]">Pedia</p>
              <p className="text-[#334155] text-[12px]">Admin</p>
            </div>
          </div>
          <div className="pl-2 py-2.5 w-[224px]">
            <div className="flex gap-2 items-center bg-[#F4F4f5] pt-1.5 py-2 rounded-sm pl-2 pr-2">
              <Zap className="w-[12px] h-[13.33px] text-[#09090B]" />
              <Link href="hotels" className="text-sm text-[#09090B]">
                Hotels
              </Link>
            </div>
            <div className="flex gap-2 items-center pt-1.5 py-2 pl-2 pr-2">
              <Zap className="w-[12px] h-[13.33px] text-[#71717A]" />
              <Link href="guests" className="text-sm text-[#71717A]">
                Guests
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-[#F4F4F5] w-[1640px] h-full">
          <div className="flex items-center gap-2 px-4 py-5">
            <PanelLeft className="p-2 w-[44px] h-[28px] border-r-2" />
            <div className="font-normal text-sm text-[#020617]">Hotels</div>
          </div>
          <div>
            <div className="flex justify-between px-4 pt-5">
              <div className="text-[24px] text-[#020617] font-bold">Hotels</div>
              <Button className="bg-[#2563EB] rounded-md py-2 px-8 gap-3">
                <p>+</p>
                <p>Add Hotel</p>
              </Button>
            </div>
          </div>
          <div className="flex gap-1 w-full px-4 py-3">
            <div className="flex-1">
              <Input placeholder="Search" />
            </div>
            <Select>
              <SelectTrigger className="w-[156px]">
                <SelectValue placeholder="Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="President">President</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[156px]">
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
              <SelectTrigger className="w-[156px]">
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
            <Table className="border-2 bg-white">
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
                    <TableCell className="border-2 w-[892px]">{hotel.hotelName}</TableCell>
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
    </div>
  );
};
export default Page;
