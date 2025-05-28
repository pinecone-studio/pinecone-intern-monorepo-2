import { Room } from 'src/models/room.model';
import { createRoom } from 'src/resolvers/mutations/room/create-room';

jest.mock('src/models/room.model', () => ({
  Room: jest.fn().mockImplementation((data) => ({
    save: jest.fn().mockResolvedValue(data),
    ...data,
  })),
}));

describe('createRoom mutation', () => {
  const mockInput = {
    roomNumber: 101,
    price: '150',
    description: 'Sea view room',
    roomImage: ['image1.jpg'],
    isAvailable: 'true',
    bedType: 'Queen',
    numberOfBed: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a room and return success response', async () => {
    const mockSavedRoom = {
      ...mockInput,
      _id: 'mock-room-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (Room as unknown as jest.Mock).mockImplementationOnce((data) => ({
      ...data,
      ...mockSavedRoom,
      save: jest.fn().mockResolvedValue(mockSavedRoom),
    }));

    const result = await createRoom(null, { input: mockInput });

    expect(Room).toHaveBeenCalledWith(expect.objectContaining(mockInput));
    expect(result).toEqual({
      success: true,
      message: 'Room created successfully',
      data: {
        savedRoom: mockSavedRoom,
      },
    });
  });

  it('should return failure response if save throws an error', async () => {
    (Room as unknown as jest.Mock).mockImplementationOnce(() => ({
      save: jest.fn().mockRejectedValue(new Error('DB error')),
    }));

    const result = await createRoom(null, { input: mockInput });

    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
