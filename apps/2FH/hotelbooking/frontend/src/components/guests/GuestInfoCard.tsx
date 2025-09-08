'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CheckoutModal from './CheckoutModal';

interface GuestInfoCardProps {
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    guestRequest: string;
    roomNumber: string;
  };
  booking: {
    id: string;
    status: string;
    adults?: number | null;
    children?: number | null;
    checkInDate: any;
    checkOutDate: any;
  };
  onStatusUpdate: () => void;
}

const GuestInfoCard = ({ guestInfo, booking, onStatusUpdate }: GuestInfoCardProps) => {
  const formatDate = (date: any) => {
    const d = new Date(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[d.getDay()],
      month: months[d.getMonth()],
      date: d.getDate(),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-600 text-white';
      case 'COMPLETED':
        return 'bg-green-600 text-white';
      case 'CANCELLED':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const checkInFormatted = formatDate(booking.checkInDate);
  const checkOutFormatted = formatDate(booking.checkOutDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Guest Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">First Name</label>
            <p className="text-gray-900">{guestInfo.firstName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Name</label>
            <p className="text-gray-900">{guestInfo.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1">
              <Badge className={getStatusBadgeStyle(booking.status)}>{booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Guests</label>
            <p className="text-gray-900">
              {(booking as any).adults || 1} adult{((booking as any).adults || 1) > 1 ? 's' : ''}, {(booking as any).children || 0} children
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Check in</label>
            <p className="text-gray-900">
              {checkInFormatted.month} {checkInFormatted.date}, {checkInFormatted.day}, {checkInFormatted.time}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Check out</label>
            <p className="text-gray-900">
              {checkOutFormatted.month} {checkOutFormatted.date}, {checkOutFormatted.day}, {checkOutFormatted.time}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{guestInfo.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="text-gray-900">{guestInfo.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Guest Request</label>
            <p className="text-gray-900">{guestInfo.guestRequest}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <CheckoutModal bookingId={booking.id} currentStatus={booking.status} onStatusUpdate={onStatusUpdate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestInfoCard;
