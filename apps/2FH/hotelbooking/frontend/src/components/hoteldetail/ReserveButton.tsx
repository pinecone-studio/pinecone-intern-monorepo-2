'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type ReserveButtonProps = {
  roomId: string;
};

export const ReserveButton = ({ roomId }: ReserveButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push(`/booking/${roomId}/payment`);
    } else {
      localStorage.setItem('pendingRoomId', roomId);
      router.push('/login');
    }
  };

  return (
    <Button data-testid="reserve-button" onClick={handleClick} className="w-[70px] bg-blue-600 text-sm font-medium">
      Reserve
    </Button>
  );
};
