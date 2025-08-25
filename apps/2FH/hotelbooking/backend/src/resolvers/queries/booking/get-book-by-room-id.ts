import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { transformBookings } from '../../../utils/transform-booking';
import { Booking } from 'src/generated';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';
import { PlainBooking } from '../../../types/booking.types';

export const getBookingsByRoomId = async (
  _: unknown,
  { roomId }: { roomId: string },
  __: unknown,
  ___: unknown
): Promise<Booking[]> => {
  try {
    const bookings = await BookingModel.find({ roomId }).sort({ createdAt: -1 });
    
    // Convert Mongoose documents to plain objects (handle both types for testing)
    const plainBookings = convertMongooseArrayToPlain(bookings) as PlainBooking[];
    
    return transformBookings(plainBookings);
  } catch (error) {
    throw new GraphQLError('Failed to fetch bookings by room ID', {
      extensions: { code: 'ROOM_BOOKINGS_FETCH_FAILED', originalError: String(error) },
    });
  }
};
