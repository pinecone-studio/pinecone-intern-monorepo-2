'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import BreadCrumb from '../../guests/_components/BreadCrumb';
import { ChevronLeft } from 'lucide-react';
import { useGetBookingsQuery, useGetHotelQuery, useHotelDetailQuery } from '@/generated';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Page = ({ params }: { params: { id: string } }) => {
  const { data } = useHotelDetailQuery({
    variables: {
      hotelId: params.id,
    },
  });
  const { data: oneHotelData } = useGetHotelQuery({
    variables: {
      id: params.id,
    },
  });
  const { data: Bookings } = useGetBookingsQuery();
  return (
    <div className="min-h-screen px-4 py-[18px] bg-slate-50">
      <div>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <BreadCrumb />
        </div>
        <div className="flex items-center gap-2 my-4">
          <div className="flex items-center justify-center w-8 h-8 bg-white border rounded-lg ">
            <ChevronLeft size={16} />
          </div>
          <h2 className="font-semibold">{oneHotelData?.getHotel.hotelName}</h2>
        </div>
        <div className="flex gap-4">
          <div className="w-[70%] flex flex-col gap-4">
            <div className="bg-[#FFFFFF] p-6">
              <div className="text-[#09090B] text-foreground text-lg mb-4">Upcoming Bookings</div>
              <div>
                <Table className="w-full bg-white">
                  <TableHeader className="rounded-xl">
                    <TableRow className="flex items-center gap-4 border">
                      <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">ID</TableHead>
                      <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guest</TableHead>
                      <TableHead className="flex items-center flex-1 w-40 border-r-[1px] h-8 font-semibold text-black">Rooms</TableHead>
                      <TableHead className="flex items-center flex-1 font-semibold text-black h-9">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableHeader className="rounded-xl">
                    {data?.hotelDetail.map((room) => (
                      <TableRow className="flex items-center gap-4 border" key={room._id}>
                        <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">{room._id?.slice(5, 8)}</TableHead>
                        <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guest</TableHead>
                        <TableHead className="flex items-center flex-1 w-40 border-r-[1px] h-8 font-semibold text-black">Rooms</TableHead>
                        <TableHead className="flex items-center flex-1 font-semibold text-black h-9">Date</TableHead>
                      </TableRow>
                    ))}
                  </TableHeader>
                </Table>
              </div>
            </div>
          </div>
          <div className="w-[30%]"></div>
        </div>
      </div>
    </div>
  );
};
export default Page;
