import { Booking } from 'src/models/booking';
import { GraphQLError } from 'graphql';

export const getAllBookings = async () => {
  try {
    const bookings = await Booking.find().exec();
    return bookings;
  } catch (error) {
    throw new GraphQLError(
      error instanceof Error ? `Failed to fetch bookings: ${error.message}` : 'Failed to fetch bookings: Unknown error'
    );
  }
};
