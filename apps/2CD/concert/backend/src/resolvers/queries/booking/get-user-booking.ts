import { QueryResolvers, Booking } from 'src/generated';
import { bookingsModel } from 'src/models';
import { validateUser } from 'src/utils/create-booking.ts/validate-user';

export const getUserBooking: QueryResolvers['getUserBooking'] = async (_, { input }) => {
  const { userId } = input;

  if (!userId) {
    throw new Error('User ID is required');
  }

  validateUser(userId);

  try {
    const bookings = await bookingsModel.find({ user: userId }).populate('concert').populate({
      path: 'tickets.ticket',
      model: 'Ticket',
    });

    return bookings as unknown as Booking[];
  } catch (error) {
 throw new Error(`Failed to get booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
