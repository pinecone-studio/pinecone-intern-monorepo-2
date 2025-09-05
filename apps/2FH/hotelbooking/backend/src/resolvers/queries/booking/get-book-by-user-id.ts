import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { Booking } from 'src/generated';
import { transformBookings } from '../../../utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';

const ERROR_CODE = 'FETCH_FAILED';

export const getBookingsByUserId = async (_: unknown, { userId }: { userId: string }, __: unknown, ___: unknown): Promise<Booking[]> => {
  try {
    const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });

    const plainBookings = convertMongooseArrayToPlain(bookings);

    return (transformBookings(plainBookings) as Booking[])
  } catch (error) {
    throw new GraphQLError('Failed to fetch bookings by user ID', {
      extensions: { code: ERROR_CODE, originalError: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
};
