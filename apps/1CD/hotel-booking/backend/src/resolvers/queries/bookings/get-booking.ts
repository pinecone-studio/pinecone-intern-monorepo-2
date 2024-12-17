import { bookingModel } from 'src/models';

export const getBooking = async (_: unknown, { _id }: { _id: string }) => {
  if (!_id) throw new Error('id hooson bn');
  try {
    const booking = await bookingModel.findById({ _id }).populate({ path: 'roomId', populate: { path: 'hotelId' } });
    if (!booking) throw new Error('not found');
    return booking;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
