import { deleteRoom } from 'src/resolvers/mutations/room/delete-room';
import { Room } from 'src/models/room.model';

jest.mock('src/models/room.model');

describe('deleteRoom', () => {
  const mockedRoom = Room as jest.Mocked<typeof Room>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the room successfully', async () => {
    mockedRoom.findByIdAndDelete.mockResolvedValueOnce({ _id: 'room123' });

    const result = await deleteRoom(null, { id: 'room123' });

    expect(mockedRoom.findByIdAndDelete).toHaveBeenCalledWith('room123');
    expect(result).toEqual({
      success: true,
      message: 'Room deleted successfully',
    });
  });

  it('should return an error if deletion fails', async () => {
    mockedRoom.findByIdAndDelete.mockRejectedValueOnce(new Error('DB error'));

    const result = await deleteRoom(null, { id: 'room123' });

    expect(mockedRoom.findByIdAndDelete).toHaveBeenCalledWith('room123');
    expect(result).toEqual({
      success: false,
      message: 'Failed to delete room',
    });
  });
});
