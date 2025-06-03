import { Booking } from 'src/models/booking';
import { GraphQLError } from 'graphql';

export const getAllBookings = async () => {
  try {
    const bookings = await Booking.find().populate('room');
    return bookings;
  } catch (error) {
    let errorMessage = 'Failed to fetch bookings: Unknown error';
    if (error instanceof Error) {
      errorMessage = `Failed to fetch bookings: ${error.message}`;
    }
    throw new GraphQLError(errorMessage);
  }
};
