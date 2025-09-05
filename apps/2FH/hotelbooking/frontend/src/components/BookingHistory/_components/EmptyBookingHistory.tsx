import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoadingSvg } from '@/components/signup/_components/assets/LoadingSvg';

type Props = {
  user?: any;
};

export const EmptyBookingHistory = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handlePushHome = async () => {
    setLoading(true);
    await router.push('/');
  };

  return (
    <>
      <div data-testid="Empty-Booking-History" className="flex flex-col items-center gap-3">
        <Image src="/images/SuccessBooking.png" width={150} height={100} alt="Empty" />
        <div>{`${user?.getUserById.firstName}`}, you have no upcoming trips. Where are you going next?</div>
        <Button onClick={handlePushHome} className="bg-[#2563EB] hover:bg-[#4683fc] w-fit">
          {loading ? <LoadingSvg /> : 'Start Exploring'}
        </Button>
      </div>
    </>
  );
};
