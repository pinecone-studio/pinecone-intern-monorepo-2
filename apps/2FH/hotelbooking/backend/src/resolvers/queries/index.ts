import { bookingQueries } from './booking';

export const queries = {
  ...bookingQueries,
};

// Export individual functions for testing
export { 
  bookings, 
  getBooking, 
  getBookingsByUserId, 
  getBookingsByHotelId, 
  getBookingsByRoomId, 
  getBookingsByCheckOutDate,
  getBookingsByCheckInDate
} from './booking';