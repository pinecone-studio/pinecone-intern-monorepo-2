'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import BreadCrumb from '../../guests/_components/BreadCrumb';
import { ChevronLeft, Phone } from 'lucide-react';
import { useGetBookingsQuery, useGetHotelQuery, useHotelDetailQuery } from '@/generated';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HotelReveiwRating } from '@/components/BookingDetailRightSide';
import { Rating } from '@mui/material';
import HotelAbout from '@/app/(user)/(public)/hotel-detail/HotelAbout';
import HotelPolicies from '@/components/HotelPolicies';
import HotelAsked from '@/app/(user)/(public)/hotel-detail/HotelAsked';
import RightSide from '@/components/admin-hotel-detail/RightSide';
import UpcomingBookings from '@/components/admin-hotel-detail/UpcomingBookings';
import RoomTypes from '@/components/admin-hotel-detail/RoomTypes';
import UpdateHotelLocation from '../UpdateHotelLocation';
import ImageUpdate from '../AddHotelImage';
import AddRoomGeneralInfo from '../../AddRoomGeneralInfo';
import AddHotelGeneralInfo from '../../AddHotelGeneralInfo';
import HotelAmenitiesDialog from '../HotelAmenitiesDialog';

const Page = ({ params }: { params: { id: string } }) => {
  const [isOpenHotelAmenitiesDialog, setIsOpenHotelAmenitiesDialog] = useState(false);
  const [isOpenRoomGeneralInfo, setIsOpenRoomGeneralInfo] = useState(false);
  const [isOpenLocationDialog, setIsOpenLocationDialog] = useState(false);
  const [isOpenImageDialog, setIsOpenImageDialog] = useState(false);
  const [isOpenHotelGeneralInfoDialog, setIsOpenHotelGeneralInfoDialog] = useState(false);
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
      <div data-cy="Admin-Hotel-Detail-Page">
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
            <UpcomingBookings bookings={Bookings?.getBookings} />
            <RoomTypes rooms={data?.hotelDetail} setRoomOpen={setIsOpenRoomGeneralInfo} />
            <div className="p-6 bg-white rounded-md">
              <div className="flex justify-between">
                <div className="font-semibold text-black">General Info</div>
                <Button className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200" onClick={() => setIsOpenHotelGeneralInfoDialog(true)}>
                  Edit
                </Button>
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
            <div className="p-6 bg-white rounded-md">
              <div className="flex justify-between">
                <div className="font-semibold text-black">Amenities</div>
                <Button onClick={() => setIsOpenHotelAmenitiesDialog(true)} className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200">
                  Edit
                </Button>
              </div>

              <div className="w-full h-[1px] bg-[#E4E4E7] my-6" />

              <div className="flex flex-wrap gap-2" data-cy="Aminities-Badge">
                {oneHotelData?.getHotel.hotelAmenities?.map((amenity, index) => (
                  <Badge key={index} className="px-2.5 py-0.5 bg-[#F4F4F5] text-[#18181B] text-base">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white rounded-md">
              <HotelAbout hotel={oneHotelData?.getHotel} />
            </div>
            <div className="p-6 bg-white rounded-md">
              <HotelPolicies />
            </div>
            <div className="p-6 bg-white rounded-md">
              <HotelAsked hotel={oneHotelData?.getHotel} />
            </div>
          </div>
          <RightSide setIsOpenImageDialog={setIsOpenImageDialog} setIsOpenLocationDialog={setIsOpenLocationDialog} hotel={oneHotelData?.getHotel} />
        </div>
      </div>
      <AddRoomGeneralInfo open={isOpenRoomGeneralInfo} setOpen={setIsOpenRoomGeneralInfo} />
      <AddHotelGeneralInfo hotelData={oneHotelData?.getHotel} open={isOpenHotelGeneralInfoDialog} setOpen={setIsOpenHotelGeneralInfoDialog} />
      {oneHotelData?.getHotel._id && <UpdateHotelLocation hotel={oneHotelData.getHotel} hotelId={oneHotelData?.getHotel._id} open={isOpenLocationDialog} setOpen={setIsOpenLocationDialog} />}
      {oneHotelData?.getHotel._id && <HotelAmenitiesDialog open={isOpenHotelAmenitiesDialog} setOpen={setIsOpenHotelAmenitiesDialog} hotelId={oneHotelData.getHotel._id} />}
      {oneHotelData?.getHotel._id && <ImageUpdate hotel={oneHotelData.getHotel} hotelId={oneHotelData?.getHotel._id} open={isOpenImageDialog} setOpen={setIsOpenImageDialog} />}
    </div>
  );
};
export default Page;
