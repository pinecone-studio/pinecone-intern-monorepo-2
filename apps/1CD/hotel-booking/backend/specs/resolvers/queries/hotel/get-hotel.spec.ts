import { getHotel } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  hotelsModel: {
    findById: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        hotelName: 'test',
      })
      .mockReturnValueOnce(null),
  },
}));

describe('get-hotels', () => {
  it('should return one hotel', async () => {
    const response = await getHotel({}, { _id: '1' });
    expect(response).toEqual({
      _id: '1',
      hotelName: 'test',
    });
  });
  it('should return null', async () => {
    try {
      await getHotel({}, { _id: '1' });
    } catch (err) {
      expect((err as Error).message).toEqual('Hotel is not found');
    }
  });
});
