import { Badge } from '@/components/ui/badge';
import { BookingStatus, Maybe } from '@/generated';

const BookingStatusBadge = ({ status }: { status: Maybe<BookingStatus> | undefined }) => {
  return (
    <Badge
      data-cy="Booking-Status-Badge"
      className={`w-20 grid place-items-center ${status == 'cancelled' && 'bg-[#F97316] hover:bg-[#F97316]'} ${status == 'completed' && 'bg-green-600 hover:bg-green-600'} ${
        status == 'booked' && 'bg-[#2563EB] hover:bg-[#2563EB]'
      }`}
    >
      {status}
    </Badge>
  );
};
export default BookingStatusBadge;
