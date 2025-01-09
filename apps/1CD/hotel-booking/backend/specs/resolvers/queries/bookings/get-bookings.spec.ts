/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getBookings } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockResolvedValueOnce([
            {
              status: 'booked',
            },
          ]),
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockResolvedValueOnce([]),
        }),
      }),
  },
}));

describe('getBookings function', () => {
  it('should return bookings', async () => {
    const result = await getBookings!(
      {},
      {
        status: 'booked',
        hotelId: '1',
      }
    );

    expect(result).toEqual([
      {
        status: 'booked',
      },
    ]);
  });

  it('No bookings found', async () => {
    try {
      await getBookings!({}, { status: 'booked', hotelId: '2' });
    } catch (error) {
      expect((error as Error).message).toEqual('No bookings found');
    }
  });
});
