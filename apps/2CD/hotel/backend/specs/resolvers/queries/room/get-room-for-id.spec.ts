import { getRoomForId } from 'src/resolvers/queries/room/get-room-for-id';
import { Room } from 'src/models/room.model';
import { GraphQLError } from 'graphql';

jest.mock('src/models/room.model');

describe('getRoomForId', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a room by id', async () => {
    const mockRoom = { id: 'abc123', name: 'Deluxe Suite' };
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRoom),
    });

    const result = await getRoomForId(null, { id: 'abc123' });

    expect(Room.findById).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(mockRoom);
  });

  it('should throw a GraphQLError if room is not found', async () => {
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(getRoomForId(null, { id: 'not-found-id' })).rejects.toThrow(
      new GraphQLError('Room with id not-found-id not found', {
        extensions: { code: 'NOT_FOUND' },
      })
    );
  });

  it('should throw a GraphQLError on internal error', async () => {
    (Room.findById as jest.Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    await expect(getRoomForId(null, { id: 'bad-id' })).rejects.toThrow(
      GraphQLError
    );

    await expect(getRoomForId(null, { id: 'bad-id' })).rejects.toThrow(
      'Failed to fetch room'
    );
  });
});
