import { Booking } from '../generated';
import { mapMongooseToGraphQLBookingStatus } from '../resolvers/common/booking-status.mapper';
import { PlainBooking } from '../types/booking.types';

/**
 * Transforms a plain booking object to match the GraphQL Booking type
 * @param plainBooking - The plain booking object from the database
 * @returns A properly formatted Booking object for GraphQL
 */
export const transformBooking = (plainBooking: PlainBooking): Booking => {
  // Ensure all required fields are present and properly typed
  const transformed: Booking = {
    __typename: 'Booking',
    id: String(plainBooking._id || plainBooking.id),
    userId: String(plainBooking.userId),
    hotelId: String(plainBooking.hotelId),
    roomId: String(plainBooking.roomId),
    checkInDate: new Date(plainBooking.checkInDate),
    checkOutDate: new Date(plainBooking.checkOutDate),
    adults: Number(plainBooking.adults),
    children: Number(plainBooking.children),
    status: mapMongooseToGraphQLBookingStatus(plainBooking.status),
    createdAt: plainBooking.createdAt ? new Date(plainBooking.createdAt) : undefined,
    updatedAt: plainBooking.updatedAt ? new Date(plainBooking.updatedAt) : undefined
  };

  return transformed;
};

/**
 * Transforms an array of plain booking objects to match the GraphQL Booking type
 * @param plainBookings - Array of plain booking objects from the database
 * @returns Array of properly formatted Booking objects for GraphQL
 */
export const transformBookings = (plainBookings: PlainBooking[]): Booking[] => {
  if (!Array.isArray(plainBookings)) {
    return [];
  }

  return plainBookings.map(booking => transformBooking(booking));
};

/**
 * Validates that a booking object has all required fields
 * @param booking - The booking object to validate
 * @returns True if the booking is valid, false otherwise
 */
export const validateBookingData = (booking: PlainBooking): boolean => {
  const requiredFields = ['userId', 'hotelId', 'roomId', 'checkInDate', 'checkOutDate', 'adults', 'children', 'status'] as const;
  
  return requiredFields.every(field => {
    const value = booking[field];
    return value !== null && value !== undefined;
  });
};
