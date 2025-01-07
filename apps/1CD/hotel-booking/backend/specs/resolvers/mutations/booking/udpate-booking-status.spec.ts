import { BookingStatus } from 'src/generated';
import { updateBookingStatus } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  bookingModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      status: BookingStatus.Completed,
    }),
  },
}));

describe('update booking status', () => {
  it('1. it should succussfully work', async () => {
    const result = await updateBookingStatus({}, { _id: '1', status: BookingStatus.Booked });
    expect(result).toBe(BookingStatus.Completed);
  });
  it('2. if id is empty', async () => {
    try {
      await updateBookingStatus({}, { _id: '', status: BookingStatus.Completed });
    } catch (err) {
      expect((err as Error).message).toEqual('id is empty');
    }
  });
  it('3. if to update booking is not found', async () => {
    try {
      await updateBookingStatus({}, { _id: '1', status: BookingStatus.Cancelled });
    } catch (err) {
      expect((err as Error).message).toEqual('to update booking is not found');
    }
  });
});
