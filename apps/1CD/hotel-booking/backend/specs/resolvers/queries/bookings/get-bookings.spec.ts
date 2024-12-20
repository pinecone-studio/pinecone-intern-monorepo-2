/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getBookings } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          populate: jest.fn().mockResolvedValueOnce([
            {
              userId: { id: 'user1' },
              roomId: {
                id: 'room1',
                hotelId: { id: 'hotel1' },
              },
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
      {},
      {
        userId: '1',
      },
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual([
      {
        userId: { id: 'user1' },
        roomId: {
          id: 'room1',
          hotelId: { id: 'hotel1' },
        },
      },
    ]);
  });
  it('No bookings found', async () => {
    try {
      await getBookings!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect((error as Error).message).toEqual('No bookings found');
    }
  });
});
