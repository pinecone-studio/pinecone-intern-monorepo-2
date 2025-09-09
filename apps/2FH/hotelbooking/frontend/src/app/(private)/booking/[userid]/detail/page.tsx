'use client';
import { BookingDetailPageUser } from '@/components/booking-detail';
import { useParams } from 'next/navigation';

const Detail = () => {
  const params = useParams();
  const bookingId = params.bookingId as string;
  return (
    <div>
      <BookingDetailPageUser bookingId={bookingId} />
    </div>
  );
};
export default Detail;
