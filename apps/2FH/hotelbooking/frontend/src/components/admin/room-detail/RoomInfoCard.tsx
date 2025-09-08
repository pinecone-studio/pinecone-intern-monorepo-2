/* eslint-disable  */
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Users, Calendar, Zap, Home } from 'lucide-react';
import { EditRoomModal } from './EditRoomModal';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { formatFeatureText } from '@/utils/format-feature-text';

const GET_BOOKINGS_BY_ROOM_ID = gql`
  query GetBookingsByRoomId($roomId: ID!) {
    getBookingsByRoomId(roomId: $roomId) {
      id
      userId
      hotelId
      roomId
      checkInDate
      checkOutDate
      adults
      children
      status
      createdAt
      updatedAt
    }
  }
`;

interface RoomFeature {
  icon: React.ReactNode;
  text: string;
}

interface RoomInfoCardProps {
  room: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'amenities' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'amenities' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  roomId: string;
}

export const RoomInfoCard = ({ room, editModalState, setEditModalState, refetch, roomId }: RoomInfoCardProps) => {
  const router = useRouter();
  const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_BOOKINGS_BY_ROOM_ID, {
    variables: { roomId: roomId },
  });

  // Function to get room amenities/features from actual room data
  const getRoomFeatures = (): RoomFeature[] => {
    const features: RoomFeature[] = [];

    // Only use roomInformation array
    if (room.roomInformation && Array.isArray(room.roomInformation)) {
      room.roomInformation.forEach((info: string) => {
        if (info && info.trim()) {
          const formattedText = formatFeatureText(info.trim());
          features.push({ icon: <Zap size={16} />, text: formattedText });
        }
      });
    }

    // If no room information is available, show a message
    if (features.length === 0) {
      features.push({ icon: <Home size={16} />, text: 'No room information available' });
    }

    return features;
  };

  const roomFeatures = getRoomFeatures();

  // Function to distribute features evenly across columns
  const distributeFeatures = (features: RoomFeature[], columns: number): RoomFeature[][] => {
    const result: RoomFeature[][] = Array(columns)
      .fill(null)
      .map(() => []);
    features.forEach((feature, index) => {
      result[index % columns].push(feature);
    });
    return result;
  };

  const distributedFeatures = distributeFeatures(roomFeatures, 3);

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

  const roomBookings = bookingsData?.getBookingsByRoomId || [];

  // Function to get upcoming bookings (check-in date hasn't arrived yet)
  const getUpcomingBookings = (bookings: any[]) => {
    const today = new Date();
    // Set today to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);

    return bookings
      .filter((booking: any) => {
        if (booking.status !== 'BOOKED') {
          return false;
        }

        const checkInDate = new Date(booking.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);

        return checkInDate >= today;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.checkInDate).getTime();
        const dateB = new Date(b.checkInDate).getTime();
        return dateA - dateB;
      });
  };

  const upcomingBookings = getUpcomingBookings(roomBookings);

  const getCurrentBookings = (bookings: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking: any) => {
      if (booking.status !== 'BOOKED') return false;

      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      return checkIn <= today && checkOut >= today;
    });
  };

  const getPastBookings = (bookings: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking: any) => {
      const checkOut = new Date(booking.checkOutDate);
      checkOut.setHours(0, 0, 0, 0);

      return checkOut < today;
    });
  };

  const currentBookings = getCurrentBookings(roomBookings);
  const pastBookings = getPastBookings(roomBookings);

  // Function to handle booking navigation
  const handleBookingClick = (bookingId: string) => {
    router.push(`/admin/guests/${bookingId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Room Information & Upcoming Bookings</CardTitle>
        <EditRoomModal
          room={room}
          section="basic"
          isOpen={editModalState.isOpen && editModalState.section === 'basic'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'basic' })}
          refetch={refetch}
          roomId={roomId}
          data-testid="edit-room-modal"
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'basic' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Room Details</h3>

          <div>
            <div className="text-sm font-medium text-gray-600">Room Name</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{room.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Price per Night</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{room.pricePerNight}MNT</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600">Capacity</div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} className="text-blue-500" />
                <span>{room.typePerson} </span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-600">Bed Configuration</div>
            <div className="flex items-center gap-2 text-sm">
              <Bed size={16} className="text-gray-500" />
              <span>{room.bedNumber} Beds</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600">Room Information</h3>

          {roomFeatures.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {distributedFeatures.map((columnFeatures, columnIndex) => (
                <div key={columnIndex} className="space-y-3">
                  {columnFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Zap size={16} className="text-yellow-500" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No room information available</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>

          {bookingsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading bookings...</div>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">
                <div className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors duration-200">
                <div className="text-2xl font-bold text-green-600">{currentBookings.length}</div>
                <div className="text-sm text-gray-600">Current</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                <div className="text-2xl font-bold text-gray-600">{pastBookings.length}</div>
                <div className="text-sm text-gray-600">Past</div>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>

          {bookingsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading bookings...</div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No upcoming bookings for this room</p>
              <p className="text-xs text-gray-400 mt-1">Upcoming bookings are those with check-in dates from today onwards</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 5).map((booking: any) => {
                const checkInDate = new Date(booking.checkInDate);
                const today = new Date();
                const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={booking.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200" onClick={() => handleBookingClick(booking.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">Booking #{booking.id.slice(-8)}</span>
                        {daysUntilCheckIn === 0 && <Badge className="bg-orange-100 text-orange-800 text-xs">Check-in Today</Badge>}
                        {daysUntilCheckIn === 1 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Tomorrow</Badge>}
                        {daysUntilCheckIn > 1 && <Badge className="bg-blue-100 text-blue-800 text-xs">{daysUntilCheckIn} days</Badge>}
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Check-in</div>
                        <div className="font-medium">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Check-out</div>
                        <div className="font-medium">{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{booking.adults} adults</span>
                        {booking.children && booking.children > 0 && <span>, {booking.children} children</span>}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-blue-600 font-medium">Click to view details →</div>
                  </div>
                );
              })}

              {upcomingBookings.length > 5 && <div className="text-center text-sm text-gray-500">And {upcomingBookings.length - 5} more upcoming bookings...</div>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
