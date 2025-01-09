import { UpdateRoomInfoInput } from 'src/generated';
import { updateRoomInfo } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        _id: '1',
        roomName: 'Economy Single Room',
        price: 22000,
        roomType: 'Single',
        roomInformation: ['Air conditioning'],
      },
    ]),
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
  hotelsModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
      _id: '1',
    }),
  },
}));

describe('update room general info', () => {
  const input: UpdateRoomInfoInput = {
    _id: '1',
    roomName: 'Economy Single Room',
    roomType: 'Single',
    price: 22000,
    roomInformation: ['Air conditioning'],
  };
  it('if successfully updated room general info', async () => {
    const result = await updateRoomInfo({}, { input });
    expect(result).toEqual({
      _id: '1',
    });
  });

  it('If failed to update room general info', async () => {
    try {
      await updateRoomInfo({}, { input });
    } catch (error) {
      expect((error as Error).message).toBe('Error');
    }
  });
});
