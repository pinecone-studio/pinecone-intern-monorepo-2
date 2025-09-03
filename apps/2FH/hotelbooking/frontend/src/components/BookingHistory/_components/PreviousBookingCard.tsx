import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useGetRoomForBookingQuery } from '@/generated';
import { useHotelNameQuery } from '@/generated';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  hotelId: string;
  roomId: string;
  checkInDate: string;
  childrens: number;
  adults: number;
};

export const PreviousBookingCard = ({ hotelId, roomId, checkInDate, childrens, adults }: Props) => {
  const router = useRouter();
  const { userid } = useParams();

  const { data: hotelData } = useHotelNameQuery({
    variables: {
      hotelId: hotelId,
    },
  });

  const { data: roomData } = useGetRoomForBookingQuery({
    variables: {
      getRoomId: roomId,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'Completed':
        return 'bg-[#18BA51]';
      case 'Cancelled':
        return 'bg-red-500';
    }
  };

  return (
    <div className="flex items-end justify-between border-[1px] rounded-xl">
      <div className="flex gap-5">
        <div>
          <Image src={roomData?.getRoom.imageURL?.[0] || '/images/placeholder.png'} width={300} height={200} alt="Room picture" className="w-[400px] h-[200px] rounded-xl" />
        </div>
        <div className="p-4 w-fit flex flex-col justify-between">
          <div className={`w-fit px-3 py-1 rounded-full text-white ${getStatusColor(status)}`}>{status || 'Unknown'}</div>
          <div>
            <div className="font-bold">{hotelData?.hotel.name}</div>
            <div className="text-[14px] opacity-50">
              {roomData?.getRoom.__typename}, {roomData?.getRoom.name}
            </div>
          </div>
          <div>
            {childrens === 0 ? 'N/A: children' : `${childrens}: children`}, {adults === 0 ? 'N/A: adults' : `${adults}: adults`}
          </div>
          <div className="flex gap-3">
            <div className="opacity-50">Check in:</div>
            <div>{checkInDate}</div>
          </div>
          <div className="flex gap-3">
            <div className="opacity-50">Itinerary:</div>
            <div>{roomData?.getRoom.id}</div>
          </div>
        </div>
      </div>
      <div className="p-3 flex items-end">
        1
         2
          3
           4
            5 
             
        <Button onClick={() => router.push('./detail')} variant={'outline'}>
          View Detail
        </Button>
      </div>
    </div>
  );
};
