"use client";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PaymentDetails = () => {
  const router = useRouter();
  const handleCompleteBooking = () => {
    router.push('/confirmation');
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[20px] font-bold">3. Reservation Card Details</p>
      <p className="text-[14px] text-gray-500">Safe, secure transactions. Your personal information is protectd</p>

      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Name on Card</p>
        <Input />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Card Number</p>
        <Input />
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="w-[45%] flex flex-col gap-2">
          <p className="text-[14px]">Expiration Date</p>
          <Input placeholder="MM/YY" />
        </div>
        <div className="w-[45%] flex flex-col gap-2">
          <p className="text-[14px]">Security Code</p>
          <Input placeholder="CVV" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[14px]">Country</p>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
            <SelectItem value="UK">United Kingdom</SelectItem>
            <SelectItem value="AU">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-[30%] h-[40px] bg-blue-500 text-white ml-auto hover:bg-blue-600" onClick={handleCompleteBooking}>
        Complete Booking
      </Button>
    </div>
  );
};

export default PaymentDetails;
