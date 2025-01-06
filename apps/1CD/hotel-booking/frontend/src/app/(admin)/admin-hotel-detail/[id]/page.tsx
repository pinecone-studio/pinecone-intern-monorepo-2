'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import BreadCrumb from '../../guests/_components/BreadCrumb';
import { ChevronLeft, Phone, Plus } from 'lucide-react';
import { useGetBookingsQuery, useGetHotelQuery, useHotelDetailQuery } from '@/generated';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { differenceInCalendarDays, format } from 'date-fns';
import AddRoomGeneralInfo from '../../AddRoomGeneralInfo';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { HotelReveiwRating } from '@/components/BookingDetailRightSide';
import { Rating } from '@mui/material';

const Page = ({ params }: { params: { id: string } }) => {
  const [roomOpen, setRoomOpen] = useState(false);
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
  const { data: Bookings } = useGetBookingsQuery({
    variables: {
      hotelId: params.id,
    },
  });

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
                <Table className="w-full bg-white rounded-md">
                  <TableHeader className="rounded-xl">
                    <TableRow className="flex items-center gap-4 border">
                      <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">ID</TableHead>
                      <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guest</TableHead>
                      <TableHead className="flex items-center flex-1 font-semibold border-r-[1px] text-black h-9">Date</TableHead>
                      <TableHead className="flex items-center flex-1 w-40 h-8 font-semibold text-black">Rooms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableHeader className="rounded-xl max-h-[400px] overflow-y-scroll">
                    {Bookings?.getBookings?.map((booking) => (
                      <TableRow className="flex items-center gap-4 border" key={booking._id}>
                        <TableHead className="flex w-[50px] p-4 items-center text-black border-r-[1px]">{booking._id?.slice(5, 8)}</TableHead>
                        <TableHead className="flex flex-1 p-4 items-center border-r-[1px]">{booking.firstName}</TableHead>
                        <TableHead className="flex items-center p-4 flex-1 gap-2 text-black border-r-[1px] justify-center">
                          <div className="">{format(booking.checkInDate, 'MMM dd')}</div>
                          <div>-</div>
                          <div className="flex gap-2">
                            <div className=""> {format(booking.checkOutDate, 'MMM dd')}</div>
                            <div className="text-[#71717A] text-muted-foreground">({differenceInCalendarDays(booking.checkOutDate, booking.checkInDate)} night)</div>
                          </div>
                        </TableHead>
                        <TableHead className="flex items-center flex-1 w-40 p-4 text-black">{booking.roomId?.roomName}</TableHead>
                      </TableRow>
                    ))}
                  </TableHeader>
                </Table>
              </div>
            </div>
            <div className="bg-[#FFFFFF] p-6 flex flex-col gap-4">
              <div className="text-[#09090B] flex justify-between mb-4">
                <div className="text-lg text-foreground">Room Types</div>

                <Button data-cy="Add-Room-General-Info-Dialog" className="flex gap-2 text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200" onClick={() => setRoomOpen(true)}>
                  <Plus />
                  <div>Add Room</div>
                </Button>
              </div>
              <div className="flex text-black bg-[#F4F4F5] rounded-md max-w-[250px] p-2 whitespace-nowrap hover:cursor-pointer">
                <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">All Rooms</div>
                <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">1 bed</div>
                <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">2 bed</div>
              </div>
              <div>
                <Table className="w-full bg-white rounded-md">
                  <TableHeader className="rounded-xl">
                    <TableRow className="flex items-center gap-4 border">
                      <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">ID</TableHead>
                      <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guest</TableHead>
                      <TableHead className="flex items-center flex-1 font-semibold border-r-[1px] text-black h-9">Date</TableHead>
                      <TableHead className="flex items-center flex-1 w-40 h-8 font-semibold text-black">Rooms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableHeader className="rounded-xl max-h-[400px] overflow-y-scroll">
                    {data?.hotelDetail.map((room) => (
                      <TableRow className="flex items-center gap-4 border" key={room._id}>
                        <TableHead className="flex w-[50px] p-4   px-4 py-3 text-black border-r-[1px]">{room._id?.slice(5, 8)}</TableHead>
                        <TableHead className="flex flex-1 p-4 border-r-[1px]">
                          {room.images[0] && <Image src={room.images[0]} alt="image" width={2000} height={2000} className="object-cover w-12 h-12" />}
                          <div>{room.roomName}</div>
                        </TableHead>
                        <TableHead className="flex  p-4 flex-1 gap-2  text-black border-r-[1px]">{room.price}</TableHead>
                        <TableHead className="flex flex-1 w-40 p-4 text-black">{room.roomType}</TableHead>
                      </TableRow>
                    ))}
                  </TableHeader>
                </Table>
              </div>
            </div>
            <div className="p-6 bg-white ">
              <div className="flex justify-between">
                <div className="font-semibold text-black">General Info</div>
                <Button className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200">Edit</Button>
              </div>
              <div className="w-full h-[1px] bg-[#E4E4E7] my-6"></div>
              <div className="flex flex-col gap-6">
                <div>
                  <div className="mb-1 text-[#71717A] text-muted-foreground">Name</div>
                  <div className="text-black text-foreground">{oneHotelData?.getHotel.hotelName}</div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <div className="mb-1 text-[#71717A] text-muted-foreground">Phone Number</div>
                    <div className="text-foreground text-[#09090B] flex gap-1">
                      <Phone />
                      <div>72700800</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-[#71717A] text-muted-foreground">Rating</div>
                    <div className="text-foreground text-[#09090B] flex gap-1">
                      <Badge className="px-4 py-1 text-white bg-blue-500">{oneHotelData?.getHotel.userRating}</Badge>
                      <HotelReveiwRating userRating={oneHotelData?.getHotel.userRating} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-[#71717A] text-muted-foreground">Stars Rating</div>
                    {oneHotelData?.getHotel.starRating && <Rating name="persistent-rating" value={oneHotelData?.getHotel.starRating} />}
                  </div>
                </div>
                <div>
                  <div className="text-[#71717A]">Description</div>
                  <div className="text-[#09090B] text-foreground">{oneHotelData?.getHotel.description}</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex justify-between">
                <div className="font-semibold text-black">Amenities</div>
                <Button className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200">Edit</Button>
              </div>

              <div className="w-full h-[1px] bg-[#E4E4E7] my-6" />
              <div className="flex flex-wrap gap-2">
                {oneHotelData?.getHotel.hotelAmenities?.map((amenity) => (
                  <Badge className="px-2.5 py-0.5 bg-[#F4F4F5] text-[#18181B]">{amenity}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[30%]"></div>
        </div>
      </div>
      <AddRoomGeneralInfo open={roomOpen} setOpen={setRoomOpen} />
    </div>
  );
};
export default Page;
