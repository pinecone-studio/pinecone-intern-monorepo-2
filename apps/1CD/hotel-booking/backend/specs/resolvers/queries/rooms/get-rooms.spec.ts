import { getRooms } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest
      .fn()
      .mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce([
          {
            _id: '1',
            roomCount: 5,
          },
        ]),
      })
      .mockReturnValueOnce({
        populate: jest.fn().mockRejectedValueOnce(new Error('aldaa')),
      }),
  },
  bookingModel: {
    find: jest
      .fn()
      .mockResolvedValueOnce([
        {
          checkInDate: '2024-12-08',
          checkOutDate: '2024-12-12',
        },
      ])
      .mockResolvedValueOnce([]),
  },
}));

describe('get rooms', () => {
  const input = {
    checkInDate: '2024-12-08',
    checkOutDate: '2024-12-12',
  };
  it('if succussfylly worked', async () => {
    const result = await getRooms({}, { input });
    expect(result).toEqual([
      {
        _id: '1',
        roomCount: 5,
      },
    ]);
  });
  it('if unsuccussfylly worked', async () => {
    try {
      await getRooms({}, { input });
    } catch (err) {
      expect(err).toEqual(new Error('aldaa'));
    }
  });
});
