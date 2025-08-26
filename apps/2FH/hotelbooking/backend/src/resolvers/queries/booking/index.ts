// queries/booking/index.ts

import { bookings } from './bookings';
import { getBooking } from './get-booking';
import { getBookingsByUserId } from './get-book-by-user-id';
import { getBookingsByHotelId } from './get-book-by-hotel-id';
import { getBookingsByRoomId } from './get-book-by-room-id';
import { getBookingsByCheckInDate } from './get-book-checkin-date';
import { getBookingsByCheckOutDate } from './get-book-by-checkout-date';



// Export individual functions for testing
export { 
  bookings, 
  getBooking, 
  getBookingsByUserId, 
  getBookingsByHotelId, 
  getBookingsByRoomId, 
  getBookingsByCheckInDate, 
  getBookingsByCheckOutDate 
};
