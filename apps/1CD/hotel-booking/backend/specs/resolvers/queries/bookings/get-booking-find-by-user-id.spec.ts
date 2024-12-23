import { getBookingFindByUserId } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce([
          {
            userId: '1',
          },
        ]),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce([]),
      }),
  },
}));

describe('get user', () => {
  it('if successfull', async () => {
    const result = await getBookingFindByUserId({}, { userId: '1' });
    expect(result).toEqual([
      {
        userId: '1',
      },
    ]);
  });
  it('if id is empty', async () => {
    try {
      await getBookingFindByUserId({}, { userId: '' });
    } catch (err) {
      expect((err as Error).message).toEqual('no userId');
    }
  });
  it('if user not exist', async () => {
    try {
      await getBookingFindByUserId({}, { userId: '2' });
    } catch (err) {
      expect((err as Error).message).toEqual('users not found');
    }
  });
});
