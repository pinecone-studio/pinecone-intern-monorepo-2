import { addRoom } from '../../../../src/resolvers/mutations/rooms/add-room';
import { RoomTypeInput } from '../../../../src/generated';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        _id: '1',
        hotelId: '2',
        roomName: 'badral',
      },
    ]),
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        roomName: 'badral',
        hotelId: '2',
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
  hotelsModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      _id: '1',
    }),
  },
}));

describe('create hotel general info', () => {
  const input: RoomTypeInput = {
    hotelId: '1',
    roomName: 'badral',
    roomType: '1bed',
    price: 500000,
    roomInformation: ['luxury'],
  };

  it('if succesfully created room general info', async () => {
    const result = await addRoom({}, { input });
    expect(result).toEqual({
      _id: '1',
      roomName: 'badral',
      hotelId: '2',
    });
  });
  it('if unsuccesfully create hotel general info', async () => {
    try {
      await addRoom({}, { input });
    } catch (err) {
      expect((err as Error).message).toBe('Error');
    }
  });
});
