import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { transformBookings } from '../../../utils/transform-booking';
import { Booking } from 'src/generated';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';
import { PlainBooking } from '../../../types/booking.types';

export const getBookingsByHotelId = async (
  _: unknown,
  { hotelId }: { hotelId: string },
  __: unknown,
  ___: unknown
): Promise<Booking[]> => {
  try {
    const bookings = await BookingModel.find({ hotelId }).sort({ createdAt: -1 });
    
    // Convert Mongoose documents to plain objects (handle both types for testing)
    const plainBookings = convertMongooseArrayToPlain(bookings) as PlainBooking[];
    
    return transformBookings(plainBookings);
  } catch (error) {
    throw new GraphQLError('Failed to fetch bookings by hotel ID', {
      extensions: { code: 'HOTEL_BOOKINGS_FETCH_FAILED', originalError: String(error) },
    });
  }
};
