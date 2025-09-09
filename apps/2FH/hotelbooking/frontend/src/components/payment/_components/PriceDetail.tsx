import { useOtpContext } from '@/components/providers';
import { useGetRoomQuery } from '@/generated';

export const PriceDetail = () => {
  const { bookingData, nights } = useOtpContext();
  const { data: roomData } = useGetRoomQuery({
    variables: {
      getRoomId: bookingData?.roomId,
    },
    skip: !bookingData?.roomId,
  });

  return (
    <div className="p-[16px] flex flex-col gap-3">
      <div>Price Detail</div>
      <div>
        <div className="flex items-center justify-between">
          <div>{nights} nights</div>
          <div>{roomData?.getRoom.pricePerNight}$</div>
        </div>
        <div className="text-[12px] opacity-50">${roomData?.getRoom.pricePerNight} per night</div>
      </div>
      <div className="border-[1px] w-full opacity-50"></div>
      <div className="flex justify-between p-4">
        <div>Total price</div>
        <div className="font-semibold">USD {roomData?.getRoom?.pricePerNight && nights ? roomData.getRoom.pricePerNight * nights : 0}</div>
      </div>
    </div>
  );
};
