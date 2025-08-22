import { Input } from '@/components/ui/input';
export const BookingNumber = () => {
  return (
    <div className="flex gap-5">
      <div>
        <p className="text-sm font-medium">Adult Number</p>
        <Input type="number" />
      </div>
      <div>
        <p className="text-sm font-medium">Children Number</p>
        <Input type="number" />
      </div>
    </div>
  );
};
