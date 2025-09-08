import BookingDetailPage from '@/components/guests/BookingDetailPage';
import React from 'react';

interface PageProps {
  params: {
    bookingId: string;
  };
}

const page = ({ params }: PageProps) => {
  return (
    <div>
      <BookingDetailPage bookingId={params.bookingId} />
    </div>
  );
};

export default page;
