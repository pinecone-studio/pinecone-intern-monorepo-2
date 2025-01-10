import { UpdateRoomService } from 'src/generated';
import { updateRoomService } from 'src/resolvers/mutations/room/update-room-service';

jest.mock('src/models', () => ({
  roomsModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        _id: '1',
        roomService: {
          bathroom: ['bathrobes'],
          accessability: ['bathrobes'],
          entertaiment: ['bathrobes'],
          foodDrink: ['electric kettle'],
          bedroom: ['bathrobes'],
          other: ['Phone'],
        },
      },
    ]),
    findByIdAndUpdate: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
      })
      .mockRejectedValueOnce(new Error('Error')),
  },
}));

describe('update room services', () => {
  const input: UpdateRoomService = {
    _id: '1',
    roomService: {
      bathroom: ['bathrobes'],
      accessability: ['bathrobes'],
      entertaiment: ['bathrobes'],
      foodDrink: ['electric kettle'],
      bedroom: ['bathrobes'],
      other: ['Phone'],
    },
  };
  it('if successfully updated room services', async () => {
    const result = await updateRoomService({}, { input });
    expect(result).toEqual({
      _id: '1',
    });
  });

  it('If failed to update room services', async () => {
    try {
      await updateRoomService({}, { input });
    } catch (error) {
      expect((error as Error).message).toBe('Error');
    }
  });
});
