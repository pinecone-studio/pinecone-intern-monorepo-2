'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Room, Status, useRoomStatusUpdateMutation } from '@/generated';
import { useOtpContext } from '../providers';

type ReserveButtonProps = {
  room: Room;
  roomId: string;
  hotelId: string;
  adults: number;
  childrens: number;
};

export const ReserveButton = ({ room, roomId, hotelId, adults, childrens }: ReserveButtonProps) => {
  const router = useRouter();

  const { bookingData, setBookingData } = useOtpContext();
  const [updateStatus, { loading }] = useRoomStatusUpdateMutation();

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setBookingData({ ...bookingData, roomId: roomId.toString(), hotelId: hotelId });
      setBookingData((prev) => {
        const newData = { ...prev, roomId, hotelId, adults, childrens };
        localStorage.setItem('bookingData', JSON.stringify(newData));
        return newData;
      });
      try {
        await updateStatus({
          variables: {
            updateRoomId: room.id,
            input: {
              status: Status.Pending,
              bedNumber: room.bedNumber,
            },
          },
        });
        router.push(`/booking/${room.id}/payment`);
      } catch (error) {
        console.error('Error updating room status:', error);
      }
    } else {
      localStorage.setItem('pendingRoomId', room.id);
      router.push('/login');
    }
  };

  return (
    <Button data-testid="reserve-button" onClick={handleClick} className="w-[70px] bg-blue-600 text-sm font-medium" disabled={loading}>
      {loading ? 'Reserving...' : 'Reserve'}
    </Button>
  );
};
