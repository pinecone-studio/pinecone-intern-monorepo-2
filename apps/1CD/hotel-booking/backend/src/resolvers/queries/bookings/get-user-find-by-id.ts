import { bookingModel } from 'src/models';

export const getBookingFindByUserId = async (_: unknown, { userId }: { userId: string }) => {
  if (!userId) throw new Error('no userId');
  try {
    const bookings = await bookingModel.find({ userId }).populate({ path: 'roomId', populate: { path: 'hotelId' } });
    if (!bookings.length) {
      throw new Error('users not found');
    }
    return bookings;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
