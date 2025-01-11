import { updateRoomImage } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  roomsModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      _id: '1',
    }),
  },
}));

describe('update room general info', () => {
  it('if successfully updated room general info', async () => {
    const result = await updateRoomImage({}, { _id: '1', images: [] });
    expect(result).toEqual({
      _id: '1',
    });
  });
});
