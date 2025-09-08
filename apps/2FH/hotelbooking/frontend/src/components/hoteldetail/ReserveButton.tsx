'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Room, Status, useRoomStatusUpdateMutation } from '@/generated';

type ReserveButtonProps = {
  room: Room;
};

export const ReserveButton = ({ room }: ReserveButtonProps) => {
  const router = useRouter();
  const [updateStatus, { loading }] = useRoomStatusUpdateMutation();

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    if (token) {
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
