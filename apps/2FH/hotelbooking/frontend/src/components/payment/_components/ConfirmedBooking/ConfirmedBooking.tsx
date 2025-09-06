'use client';

import { useOtpContext } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { useGetRoomQuery, useHotelQuery } from '@/generated';
import Image from 'next/image';
import { RoomInformationSvg } from '../assets/RoomInformationSvg';
import { useParams, useRouter } from 'next/navigation';

export const ConfirmedBooking = () => {
  const router = useRouter();
  const { userid } = useParams();
  const { bookingData } = useOtpContext();
  const { data } = useHotelQuery({
    variables: {
      hotelId: bookingData.hotelId,
    },
  });

  const { data: roomData } = useGetRoomQuery({
    variables: { getRoomId: bookingData.roomId },
  });

  const handlePushHistoryPage = async () => {
    router.push(`/booking/${userid}/history`);
  };

  return (
    <div data-cy="Confirmed-Booking-Container" data-testid="Confirmed-Booking-Container" className="w-[30%]">
      <div className="w-full flex justify-center">
        <Image src="/images/SuccessBooking.png" width={150} height={150} alt="Picture of the author" />
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <div className="w-full font-semibold text-[25px] pt-5">You are confirmed</div>
          <div className="w-full flex justify-between pt-3 pb-3">
            <div>Contact email</div>
            <div>samlee.mobbin@gmail.com</div>
          </div>
          <Button data-testid="Push-History-Page" onClick={handlePushHistoryPage} className="bg-[#2563EB] hover:bg-[#2564ebda] w-[30%]">
            View your book
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-5 border-[2px] rounded-xl">
          <div>
            <div className="font-semibold text-[20px]">{data?.hotel.name}</div>
            <div className="opacity-70">{data?.hotel.location}</div>
            <div className="flex gap-3">
              <div className=" bg-[#2563EB] text-white w-fit px-3 rounded-full">{data?.hotel.rating} </div>
              <div className="font-medium">Excellent</div>
            </div>
          </div>
          <div className="w-full border-[1px]"></div>
          <div className="flex flex-col gap-3">
            <div className="opacity-50">Check in</div>
            <div>{bookingData.checkInDate}</div>
            <div className="opacity-50">Check out</div>
            <div>{bookingData.checkOutDate}</div>
          </div>
          <div className="w-full border-[1px]"></div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 items-center">
              <RoomInformationSvg /> <div>{roomData?.getRoom.name}</div>
            </div>
            <div className="flex gap-1 items-center">
              <RoomInformationSvg /> <div>{roomData?.getRoom.foodAndDrink[0]}</div>
            </div>
            <div className="flex gap-1 items-center">
              <RoomInformationSvg /> <div>{roomData?.getRoom.bedRoom[2]}</div>
            </div>
            <div className="flex gap-1 items-center">
              <RoomInformationSvg /> <div>{roomData?.getRoom.internet[0]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
