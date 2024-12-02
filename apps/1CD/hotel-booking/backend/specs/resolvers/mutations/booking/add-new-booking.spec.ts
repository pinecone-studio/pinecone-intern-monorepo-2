import { BookingInput } from 'src/generated';
import { addNewBooking } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  bookingModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '674ad1f265ca6d2c473739b7',
        userId: '1',
        roomId: '2',
        hotelId: '3',
      })
      .mockRejectedValueOnce(new Error('Promise function has error')),
  },
}));

describe('add new booking', () => {
  const input: BookingInput = {
    userId: '1',
    roomId: '2',
    hotelId: '3',
    checkInDate: '2024-01-05',
    checkOutDate: '2024-01-08',
    totalPrice: 50000,
  };
  it('if add booking is successfully runned', async () => {
    const result = await addNewBooking({}, { input });
    expect(result).toEqual({
      _id: '674ad1f265ca6d2c473739b7',
      userId: '1',
      roomId: '2',
      hotelId: '3',
    });
  });
  it('if add booking is unsuccessfully run', async () => {
    try {
      await addNewBooking({}, { input });
    } catch (err) {
      expect((err as Error).message).toBe('Promise function has error');
    }
  });
});
