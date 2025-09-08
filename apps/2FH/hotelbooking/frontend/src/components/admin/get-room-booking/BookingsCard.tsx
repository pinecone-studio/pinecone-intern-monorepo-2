'use client';
import { useGetBookingsByHotelIdQuery } from '@/generated';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface BookingsCardProps {
  hotelId: string;
}

const BookingsCard = ({ hotelId }: BookingsCardProps) => {
  const router = useRouter();

  const {
    data: bookingsData,
    loading,
    error,
  } = useGetBookingsByHotelIdQuery({
    variables: { hotelId },
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">Error loading bookings: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const bookings = bookingsData?.getBookingsByHotelId || [];

  const getStatusBadge = (status: string | null | undefined) => {
    const statusConfig = {
      BOOKED: { color: 'bg-green-100 text-green-800', label: 'Booked' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
    };

    const statusValue = status || 'UNKNOWN';
    const config = statusConfig[statusValue as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: statusValue,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/guests/${bookingId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bookings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No bookings found</div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleViewBooking(booking.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium">#{booking.id.slice(-8)}</div>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {booking.adults || 0} Adults
                      {(booking.children || 0) > 0 && `, ${booking.children} Children`}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{bookings.filter((b) => b.status === 'BOOKED').length}</div>
            <div className="text-sm text-gray-600">Booked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{bookings.filter((b) => b.status === 'CANCELLED').length}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsCard;
