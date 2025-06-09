import { getAllRooms } from 'src/resolvers/queries/room/get-all-rooms';
import { Room } from 'src/models/room.model';

// Mock the Room model
jest.mock('src/models/room.model', () => ({
  Room: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn(),
  },
}));

describe('getAllRooms', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all rooms with populated hotel', async () => {
    const mockRooms = [
      { _id: '1', name: 'Room A', hotel: { name: 'Hotel X' } },
      { _id: '2', name: 'Room B', hotel: { name: 'Hotel Y' } },
    ];

    (Room.find as jest.Mock).mockReturnThis();
    (Room.populate as jest.Mock).mockResolvedValue(mockRooms);

    const result = await getAllRooms();

    expect(Room.find).toHaveBeenCalled();
    expect(Room.populate).toHaveBeenCalledWith('hotel');
    expect(result).toEqual(mockRooms);
  });

  it('should return error response on failure', async () => {
    (Room.find as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await getAllRooms();

    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
