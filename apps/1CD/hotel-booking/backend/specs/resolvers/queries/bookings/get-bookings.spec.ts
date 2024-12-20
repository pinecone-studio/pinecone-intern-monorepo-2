/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getBookings } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    find: jest.fn().mockReturnValueOnce([
      {
        _id: '674ad1f265ca6d2c473739b7',
        userId: '1',
      },
    ]),
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
        _id: '674ad1f265ca6d2c473739b7',
        userId: '1',
      },
    ]);
  });
  it('if bookings not found', async () => {
    try {
      await getBookings!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect((error as Error).message).toEqual('Bookings not found');
    }
  });
});
