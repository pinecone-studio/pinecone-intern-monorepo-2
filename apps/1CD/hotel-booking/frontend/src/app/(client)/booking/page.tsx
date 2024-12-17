'use client';

import ConfirmedBooking from '@/components/ConfirmedBooking';
import PriviousBooking from '@/components/PreviousBooking';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="container mx-auto max-w-[960px] flex flex-col gap-8">
      <div>
        <div className="text-2xl font-semibold p-4">Booking</div>
        <div className="max-w-[896px] flex flex-col items-center gap-4">
          <div className="w-[123.22px] h-[131.45px]">
            <Image src="/images/Frame.png" alt="image" width={140} height={140}></Image>
          </div>
          <div>
            <p>Shagai, you have no upcoming trips.</p>
            <p>Where are you going next?</p>
          </div>
          <Button className="bg-[#2563EB] text-sm font-medium text-[#FAFAFA]">Start Exploring</Button>
        </div>
      </div>
      <div>
        <PriviousBooking />
      </div>
    </div>
  );
};
export default Page;
