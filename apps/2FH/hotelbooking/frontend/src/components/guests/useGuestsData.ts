/* eslint-disable  */
import { useState, useMemo, useEffect } from 'react';
import { useGetAllBookingsQuery, useHotelsQuery, useGetUserByIdLazyQuery } from '@/generated';

interface BookingWithDetails {
  id: string;
  originalId: string;
  name: string;
  hotel: string;
  rooms: string;
  guests: string;
  date: string;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
}

const getRoomType = (roomId: string): string => {
  const roomTypes = ['Economy Double Room, City View', 'Standard Twin Room, City View', 'Deluxe Twin Room, City View', 'Executive Suite, City View', 'Presidential Suite, City View'];
  const hash = roomId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return roomTypes[hash % roomTypes.length];
};

const formatDateRange = (checkIn: string | Date, checkOut: string | Date): string => {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
};

export const useGuestsData = () => {
  const { data, loading, error } = useGetAllBookingsQuery();
  const { data: hotelsData, loading: hotelsLoading } = useHotelsQuery();

  // Get unique user IDs from bookings
  const userIds = useMemo(() => {
    if (!data?.bookings) return [];
    return [...new Set(data.bookings.map((booking) => booking.userId))];
  }, [data?.bookings]);

  // Use lazy query to fetch users individually
  const [getUserById] = useGetUserByIdLazyQuery();
  const [usersData, setUsersData] = useState<{ [key: string]: { firstName?: string; lastName?: string } }>({});
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch users when userIds change
  useEffect(() => {
    if (userIds.length === 0) return;

    const fetchUsers = async () => {
      setUsersLoading(true);
      const userPromises = userIds.map(async (userId) => {
        try {
          const result = await getUserById({
            variables: { input: { _id: userId } },
          });
          return { userId, user: result.data?.getUserById };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { userId, user: null };
        }
      });

      const results = await Promise.all(userPromises);
      const usersMap: { [key: string]: { firstName?: string; lastName?: string } } = {};
      results.forEach(({ userId, user }) => {
        if (user) {
          usersMap[userId] = { firstName: user.firstName || '', lastName: user.lastName || '' };
        }
      });

      setUsersData(usersMap);
      setUsersLoading(false);
    };

    fetchUsers();
  }, [userIds, getUserById]);

  // Create hotels mapping for efficient lookup
  const hotelsMap = useMemo(() => {
    if (!hotelsData?.hotels) return new Map();
    return new Map(hotelsData.hotels.map((hotel) => [hotel.id, hotel.name]));
  }, [hotelsData?.hotels]);

  // Create users mapping for efficient lookup
  const usersMap = useMemo(() => {
    if (!usersData || Object.keys(usersData).length === 0) {
      return new Map();
    }
    return new Map(Object.entries(usersData).map(([userId, user]) => [userId, `${user.firstName || ''} ${user.lastName || ''}`.trim()]));
  }, [usersData]);

  interface BookingData {
    id: string;
    userId: string;
    hotelId: string;
    roomId: string;
    adults?: number;
    children?: number;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  }

  const transformBooking = (booking: BookingData): BookingWithDetails => ({
    id: booking.id.slice(-4).padStart(4, '0'), // Show last 4 digits with leading zeros
    originalId: booking.id, // Keep original ID for navigation
    name: usersMap.get(booking.userId) || `Guest ${booking.userId.slice(-8)}`, // Real user name or fallback
    hotel: hotelsMap.get(booking.hotelId) || 'Unknown Hotel', // Real hotel name from hotels data
    rooms: getRoomType(booking.roomId), // Generated room type based on roomId
    guests: `${booking.adults || 1} Adult${(booking.adults || 1) > 1 ? 's' : ''}${booking.children ? `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}` : ''}`,
    date: formatDateRange(booking.checkInDate, booking.checkOutDate),
    status: booking.status,
  });

  // Transform booking data to match the table structure
  const transformedBookings: BookingWithDetails[] = useMemo(() => {
    if (!data?.bookings) return [];
    return data.bookings.map(transformBooking as any);
  }, [data?.bookings, hotelsMap, usersMap]);

  return {
    bookings: transformedBookings,
    loading: loading || hotelsLoading || usersLoading,
    error,
  };
};
