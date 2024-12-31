import { RoomServiceInput } from '../../../../src/generated';
import { addRoomService } from '../../../../src/resolvers/mutations';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        _id: '1',
        hotelId: '2',
        roomName: 'badral',
      },
    ]),
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        id: '674851d9066230f0d7f74866',
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
  hotelsModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      _id: '1',
    }),
  },
}));

describe('add room services', () => {
  const roomId = '1';
  const input: RoomServiceInput = {
    bathroom: ['bathrobes', 'toiletries'],
    accessability: ['thin carpet in room'],
    entertaiment: ['cable channels', 'Tv'],
    foodDrink: ['electric kettle'],
    bedroom: ['air conditioning', 'bed sheets'],
    other: ['Desk', 'phone', 'safe'],
  };
  it('if successfully added room services', async () => {
    const result = await addRoomService({}, { input, roomId });
    expect(result).toEqual({
      id: '674851d9066230f0d7f74866',
    });
  });
  it('if failed to add room services', async () => {
    try {
      await addRoomService({}, { input, roomId });
    } catch (error) {
      expect((error as Error).message).toBe('Error');
    }
  });
});
