/* eslint-disable  */
import { useGetBookingQuery, useHotelQuery, useGetRoomQuery, useGetUserByIdQuery } from '@/generated';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Booking {
  userId?: string;
  roomId?: string;
}

const createGuestInfo = (user: User | undefined, booking: Booking | undefined) => ({
  firstName: user?.firstName || 'Guest',
  lastName: user?.lastName || booking?.userId?.slice(-8) || '',
  email: user?.email || `${booking?.userId?.slice(-8) || ''}@example.com`,
  phone: '+976 99112233', // Phone not available in user data
  guestRequest: 'No Request', // Guest request not available in user data
  roomNumber: `Room #${booking?.roomId?.slice(-3) || ''}`,
});

export const useBookingDetailData = (bookingId: string) => {
  const {
    data: bookingData,
    loading: bookingLoading,
    error: bookingError,
    refetch,
  } = useGetBookingQuery({
    variables: { getBookingId: bookingId },
    skip: !bookingId,
  });

  const { data: hotelData, loading: hotelLoading } = useHotelQuery({
    variables: { hotelId: bookingData?.getBooking?.hotelId || '' },
    skip: !bookingData?.getBooking?.hotelId,
  });

  const { data: roomData, loading: roomLoading } = useGetRoomQuery({
    variables: { getRoomId: bookingData?.getBooking?.roomId || '' },
    skip: !bookingData?.getBooking?.roomId,
  });

  const { data: userData, loading: userLoading } = useGetUserByIdQuery({
    variables: { input: { _id: bookingData?.getBooking?.userId || '' } },
    skip: !bookingData?.getBooking?.userId,
  });

  const booking = bookingData?.getBooking;
  const hotel = hotelData?.hotel;
  const room = roomData?.getRoom;
  const user = userData?.getUserById;

  // Use real guest info from user data
  const guestInfo = createGuestInfo(user as User, booking);

  const handleStatusUpdate = () => {
    refetch();
  };

  return {
    booking,
    hotel,
    room,
    guestInfo,
    loading: bookingLoading || hotelLoading || roomLoading || userLoading,
    error: bookingError,
    onStatusUpdate: handleStatusUpdate,
  };
};
