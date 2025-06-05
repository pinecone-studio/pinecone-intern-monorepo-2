import { getRoomForId } from 'src/resolvers/queries/room/get-room-for-id';
import { Room } from 'src/models/room.model';

jest.mock('src/models/room.model');

describe('getRoomForId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a room object when found', async () => {
    const mockRoom = { id: 'abc123', name: 'Deluxe Suite' };
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRoom),
    });

    const result = await getRoomForId(null, { id: 'abc123' });

    expect(Room.findById).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(mockRoom);
  });

  it('should return success: false and data: null when room not found', async () => {
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await getRoomForId(null, { id: 'not-found-id' });

    expect(Room.findById).toHaveBeenCalledWith('not-found-id');
    expect(result).toEqual({
      success: false,
      data: null,
    });
  });

  it('should return success: false and data: null on error', async () => {
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const result = await getRoomForId(null, { id: 'error-id' });

    expect(Room.findById).toHaveBeenCalledWith('error-id');
    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
