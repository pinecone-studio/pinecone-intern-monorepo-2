/* eslint-disable complexity */
import { BookingsType } from 'src/generated';
import { bookingModel } from 'src/models';

type BookingsFilterType = {
  status?: string;
  hotelId?: string;
};

export const getBookings = async (_: unknown, { status, hotelId }: { status: string; hotelId: string }) => {
  const filter: BookingsFilterType = {};

  if (status) {
    filter['status'] = status;
  }
  if (hotelId) {
    filter.hotelId = hotelId;
  }
  try {
    const bookings: BookingsType[] = await bookingModel
      .find(filter)
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
