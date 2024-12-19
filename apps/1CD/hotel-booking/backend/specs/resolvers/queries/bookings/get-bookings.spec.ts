/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { getBookings } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    find: jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue([
        {
          _id: '674ad1f265ca6d2c473739b7',
          userId: '1',
        },
      ]),
    }),
  },
}));

describe('get bookings', () => {
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
});
