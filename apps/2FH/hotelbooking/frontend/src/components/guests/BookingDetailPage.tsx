/* eslint-disable  */
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookingDetailData } from './useBookingDetailData';
import GuestInfoCard from './GuestInfoCard';
import RoomDetailsCard from './RoomDetailsCard';
import PriceDetailCard from './PriceDetailCard';

interface BookingDetailPageProps {
  bookingId: string;
}

const BookingDetailPage = ({ bookingId }: BookingDetailPageProps) => {
  const router = useRouter();
  const { booking, room, guestInfo, loading, error, onStatusUpdate } = useBookingDetailData(bookingId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading booking details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Guests</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Guest Info</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2" aria-label="Go back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {guestInfo.firstName} {guestInfo.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Guest Information */}
        <div className="space-y-6">
          <GuestInfoCard
            guestInfo={guestInfo}
            booking={{
              id: booking.id,
              status: booking.status || 'BOOKED',
              adults: booking.adults,
              children: booking.children,
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
            }}
            onStatusUpdate={onStatusUpdate}
          />
        </div>

        {/* Right Panel - Room and Price Details */}
        <div className="space-y-6">
          <RoomDetailsCard room={room} booking={booking} />
          <PriceDetailCard room={room} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
