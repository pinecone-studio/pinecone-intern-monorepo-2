import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { transformBookings } from '../../../utils/transform-booking';
import { Booking } from 'src/generated';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';

export const getBookingsByRoomId = async (
  _: unknown,
  { roomId }: { roomId: string },
  __: unknown,
  ___: unknown
): Promise<Booking[]> => {
  try {
    const bookings = await BookingModel.find({ roomId }).sort({ createdAt: -1 });
    
console.log(bookings);

    const plainBookings = convertMongooseArrayToPlain(bookings);

    
    return transformBookings(plainBookings) as Booking[];
  } catch (error) {
    throw new GraphQLError('Failed to fetch bookings by room ID', {
      extensions: { code: 'ROOM_BOOKINGS_FETCH_FAILED', originalError: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
};
