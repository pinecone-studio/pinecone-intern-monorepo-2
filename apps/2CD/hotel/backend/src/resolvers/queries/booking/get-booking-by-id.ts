import { Booking } from '../../../models/booking';
import { GraphQLError } from 'graphql';

export const getBookingById = async (_parent: unknown, { id }: { id: string }) => {
  try {
    const booking = await Booking.findById(id).exec();

    if (!booking) {
      throw new Error(`Booking with id ${id} not found`);
    }

    return booking;
  } catch (error) {
    throw new GraphQLError(
      error instanceof Error
        ? `Failed to fetch booking: ${error.message}`
        : 'Failed to fetch booking: Unknown error'
    );
  }
};
