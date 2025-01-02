import { getRoom } from 'src/resolvers/queries/rooms/get-room';

jest.mock('src/models', () => ({
  roomsModel: {
    findById: jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce({
        _id: '1',
      }),
    }),
  },
}));

describe("get room function's test", () => {
  it('should return room and populate hotel id ', async () => {
    const result = await getRoom({}, { _id: '1' });
    expect(result).toEqual({ _id: '1' });
  });
  it('return id must be required', async () => {
    try {
      await getRoom({}, { _id: '' });
    } catch (err) {
      expect((err as Error).message).toEqual('id must be required');
    }
  });
});
