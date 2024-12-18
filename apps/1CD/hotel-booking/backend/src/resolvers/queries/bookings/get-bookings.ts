import { QueryResolvers } from 'src/generated';
import { bookingModel } from 'src/models';

export const getBookings: QueryResolvers['getBookings'] = async () => {
  try {
    const bookings = await bookingModel.find({});
    if (!bookings) throw new Error('Bookings not found');
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings', error);
    throw new Error((error as Error).message);
  }
};
