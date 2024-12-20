import { QueryResolvers, BookingsType } from 'src/generated';
import { bookingModel } from 'src/models';

export const getBookings: QueryResolvers['getBookings'] = async () => {
  try {
    const bookings: BookingsType[] = await bookingModel
      .find()
      .populate({ path: 'userId' })
      .populate({
        path: 'roomId',
        populate: { path: 'hotelId' },
      });

    if (!bookings || bookings.length === 0) {
      throw new Error('No bookings found');
    }

    return bookings;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
