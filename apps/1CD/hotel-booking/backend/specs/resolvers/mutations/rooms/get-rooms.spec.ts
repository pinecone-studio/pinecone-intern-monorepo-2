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
}));

describe('get rooms', () => {
  it('if succussfylly worked', async () => {
    const result = await getRooms();
    expect(result).toEqual([
      {
        _id: '1',
        roomCount: 5,
      },
    ]);
  });
  it('if unsuccussfylly worked', async () => {
    try {
      await getRooms();
    } catch (err) {
      expect(err).toEqual(new Error('aldaa'));
    }
  });
});
