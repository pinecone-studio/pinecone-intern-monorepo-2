import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Booking, useGetRoomForBookingQuery } from '@/generated';
import { useHotelNameQuery } from '@/generated';
import { useRouter } from 'next/navigation';
import { AdultInfoForBookingCard } from './AdultsInformationForBookedCard';
type Props = {
  confirmedBooking: Pick<Booking, 'id' | 'hotelId' | 'roomId' | 'checkInDate' | 'status' | 'adults' | 'children'>;
};

export const BookedCard = ({ confirmedBooking }: Props) => {
  const router = useRouter();
  const { data: hotelData } = useHotelNameQuery({
    variables: {
      hotelId: confirmedBooking.hotelId,
    },
  });
  const { data: roomData } = useGetRoomForBookingQuery({
    variables: {
      getRoomId: confirmedBooking.roomId,
    },
  });
  console.log(confirmedBooking.children);

  return (
    <div className="flex items-end  justify-between border-[1px] rounded-xl">
      <div className="flex gap-5">
        <div>
          <Image src={roomData?.getRoom.imageURL?.[0] || '/images/placeholder.png'} width={300} height={200} alt="Room picture [0]" className="w-[400px] h-[200px] rounded-xl" />
        </div>
        <div className="p-4 w-fit flex flex-col justify-between">
          <div className={`w-fit px-3 py-1 rounded-full text-white ${roomData?.getRoom.status === 'Booked' && 'bg-[#18BA51]'}`}>{roomData?.getRoom.status}</div>
          <div></div>
          <div>
            <div className="font-bold">{hotelData?.hotel.name}</div>
            <div className="text-[14px] opacity-50">
              {roomData?.getRoom.__typename} ,{roomData?.getRoom.name}
            </div>
          </div>
          {confirmedBooking?.adults && <AdultInfoForBookingCard adults={confirmedBooking?.adults} />}
          <div className="flex gap-3">
            <div className="opacity-50">Check in:</div>
            <div> {confirmedBooking.checkInDate}</div>
          </div>
          <div className="flex gap-3">
            <div className="opacity-50">Itinerary:</div>
            <div> {confirmedBooking.id}</div>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-end">
        <Button onClick={() => router.push('./detail')} variant={'outline'}>
          View Detail
        </Button>
      </div>
    </div>
  );
};
