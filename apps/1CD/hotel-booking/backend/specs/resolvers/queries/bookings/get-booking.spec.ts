import { getBooking } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  bookingModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          _id: '1',
        }),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce(null),
      }),
  },
}));

describe('get rooms', () => {
  it('if succussfylly worked', async () => {
    const result = await getBooking(
      {},
      {
        _id: '1',
      }
    );
    expect(result).toEqual({
      _id: '1',
    });
  });
  it('if id is empty', async () => {
    try {
      await getBooking({}, { _id: '' });
    } catch (err) {
      expect((err as Error).message).toEqual('id hooson bn');
    }
  });
  it('if item is not found', async () => {
    try {
      await getBooking({}, { _id: '2' });
    } catch (err) {
      expect((err as Error).message).toEqual('not found');
    }
  });
});
