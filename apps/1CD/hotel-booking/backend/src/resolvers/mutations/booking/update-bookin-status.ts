import { BookingStatus } from 'src/generated';
import { bookingModel } from 'src/models';

export const updateBookingStatus = async (_: unknown, { _id, status }: { _id: string; status: BookingStatus }) => {
  if (!_id) throw new Error('id is empty');

  try {
    const updatedBookingStatus = await bookingModel.findByIdAndUpdate({ _id }, { status }, { new: true });
    if (!updatedBookingStatus) throw new Error('to update booking is not found');
    return updatedBookingStatus.status;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
