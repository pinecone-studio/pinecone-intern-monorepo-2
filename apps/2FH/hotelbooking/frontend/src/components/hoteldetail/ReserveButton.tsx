'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Status, useRoomStatusUpdateMutation } from '@/generated';

type ReserveButtonProps = {
  roomId: string;
};

export const ReserveButton = ({ roomId }: ReserveButtonProps) => {
  const router = useRouter();
  const [updateStatus, { loading }] = useRoomStatusUpdateMutation();

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await updateStatus({
          variables: {
            updateRoomId: roomId,
            input: {
              status: Status.Pending,
            },
          },
        });
        router.push(`/booking/${roomId}/payment`);
      } catch (error) {
        console.error('Error updating room status:', error);
      }
    } else {
      localStorage.setItem('pendingRoomId', roomId);
      router.push('/login');
    }
  };

  return (
    <Button data-testid="reserve-button" onClick={handleClick} className="w-[70px] bg-blue-600 text-sm font-medium" disabled={loading}>
      {loading ? 'Reserving...' : 'Reserve'}
    </Button>
  );
};
