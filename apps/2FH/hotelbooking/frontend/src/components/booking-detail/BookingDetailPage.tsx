'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useGetBookingQuery, useUpdateBookingMutation, useHotelQuery, BookingStatus } from '@/generated';
import { useRouter } from 'next/navigation';
import { CancellationRules } from './components/CancellationRules';
import { BookingInfo } from './components/BookingInfo';
import { PropertySupport } from './components/PropertySupport';
import { HotelImage } from './components/HotelImage';
import { CancelBookingModal } from './components/CancelBookingModal';
import { HotelLoader } from '../loadingComponent/Loader';

/* eslint-disable-next-line */
export const BookingDetailPageUser = ({ bookingId }: { bookingId: string }) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: bookingData, loading: bookingLoading } = useGetBookingQuery({
    variables: { getBookingId: bookingId },
  });

  const [updateBooking] = useUpdateBookingMutation();

  const booking = bookingData?.getBooking;

  const { data: hotelData, loading: hotelLoading } = useHotelQuery({
    skip: !booking?.hotelId,
    variables: { hotelId: booking?.hotelId || '' },
  });

  const hotelNumber = hotelData?.hotel?.phone;

  const handleCancelBooking = async () => {
    if (!booking) return;

    setIsCancelling(true);
    try {
      await updateBooking({
        variables: {
          updateBookingId: booking.id,
          input: {
            status: BookingStatus.Cancelled,
          },
        },
      });
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (bookingLoading || hotelLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HotelLoader />
      </div>
    );
  }

  if (!booking || !hotelData?.hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">No Booking Found</div>
          <div className="text-gray-600">The requested booking could not be found.</div>
        </div>
      </div>
    );
  }

  const hotel = hotelData.hotel;
  const hotelImage = hotel.images?.[0] || '/Images/NoImage.png';
  const isBooked = booking.status === BookingStatus.Booked;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Booking Details</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CancellationRules />
            <BookingInfo
              hotelName={hotel.name}
              bookingStatus={booking.status!}
              checkInDate={booking.checkInDate}
              checkOutDate={booking.checkOutDate}
              adults={booking.adults || 0}
              childrens={booking.children || 0}
              roomId={booking.roomId}
              isBooked={isBooked}
              onCancelClick={() => setShowCancelModal(true)}
            />
            <PropertySupport hotelName={hotel.name} bookingId={booking.id} hotelNumber={hotelNumber || ''} />
          </div>

          {/* Right Column - Hotel Image and Info */}
          <div className="space-y-6">
            <HotelImage hotelName={hotel.name} hotelLocation={hotel.location} hotelImage={hotelImage} hotelRating={hotel.rating} />
          </div>
        </div>
      </div>

      <CancelBookingModal isOpen={showCancelModal} isCancelling={isCancelling} onClose={() => setShowCancelModal(false)} onConfirm={handleCancelBooking} />
    </div>
  );
};
