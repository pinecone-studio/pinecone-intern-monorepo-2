import { RoomInformationSvg } from '@/components/payment/_components/assets/RoomInformationSvg';
import Image from 'next/image';
import { PriceDetail } from './PriceDetail';
import { useGetRoomQuery, useHotelByIdForBookingQuery } from '@/generated';
import { NoImage } from './assets/NoImage';
import { useOtpContext } from '@/components/providers';
export const RoomInformation = () => {
  const { bookingData } = useOtpContext();
  const { data: hotelData } = useHotelByIdForBookingQuery({
    variables: {
      hotelId: '68b7bee57d52b027d4752888',
    },
  });

  const { data: roomData } = useGetRoomQuery({
    variables: {
      getRoomId: bookingData?.roomId || '',
    },
    skip: !bookingData?.roomId,
  });

  return (
    <div data-testid="Room-Information-Container" className="w-full flex flex-col gap-3">
      <div className="relative w-full h-[200px]">
        {roomData?.getRoom.imageURL?.[0] ? (
          roomData.getRoom.imageURL[0] === '/WhiteImage.jpeg' ? (
            <div className="w-full h-full flex items-center justify-center border-[1px]">
              <NoImage />
            </div>
          ) : (
            <Image src={roomData.getRoom.imageURL[0]} fill alt={'Hotel Image'} className="rounded-xl" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center border-[1px]">
            <NoImage />
          </div>
        )}
      </div>
      <div className="p-[16px] flex flex-col gap-3 border-[1px] border-opacity-50 border-t-0 rounded-xl">
        <div className="flex flex-col gap-3 ">
          <div className="font-semibold">{hotelData?.hotel.name}</div>
          <div className="opacity-50">{hotelData?.hotel.location}</div>
          <div className="flex gap-3">
            <div className="bg-[#2563EB] text-white px-2 rounded-full">{hotelData?.hotel.rating}</div>
            <div>Excellent</div>
          </div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div>
          <div className="opacity-50">Check in</div>
          <div>{bookingData.checkInDate}</div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div>
          <div className="opacity-50">Check out</div>
          <div>{bookingData.checkOutDate}</div>
        </div>
        <div className="border-[1px] w-full opacity-50"></div>
        <div className="flex flex-col gap-3">
          <div className="opacity-50">{roomData?.getRoom.typePerson}</div>
          <div className="flex gap-5 justify-between w-[60%]">
            <div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">{roomData?.getRoom.name}</div>
              </div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">{roomData?.getRoom.foodAndDrink}</div>
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">{roomData?.getRoom.other}</div>
              </div>
              <div className="flex gap-2 items-center">
                <RoomInformationSvg /> <div className="opacity-60">{roomData?.getRoom.roomInformation[0]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[1px] rounded-xl">
        <PriceDetail />
      </div>
    </div>
  );
};
