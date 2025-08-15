import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { getRooms } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  RoomModel: {
    find: jest.fn(),
  },
}));

describe('getRoomsByHotelId', () => {
  const mockContext = {} as any;
  const mockInfo = {} as any;

  const mockRoom = {
    _id: '123',
    name: 'Test Room',
    pricePerNight: 100,
    images: ['https://example.com/image1.jpg'],
    toObject: jest.fn().mockReturnValue({
      _id: '123',
      name: 'Test Room',
      pricePerNight: 100,
      images: ['https://example.com/image1.jpg'],
    }),
  };

  const mockRoomNoImages = {
    _id: '124',
    name: 'Room Without Images',
    pricePerNight: 80,
    toObject: jest.fn().mockReturnValue({
      _id: '124',
      name: 'Room Without Images',
      pricePerNight: 80,
      images: undefined,
    }),
  };

  afterEach(() => jest.clearAllMocks());

  it('returns rooms array when hotelId is valid', async () => {
    (RoomModel.find as jest.Mock).mockResolvedValueOnce([mockRoom]);

    const result = await getRooms!({}, { hotelId: 'valid-id' }, mockContext, mockInfo);

    expect(RoomModel.find).toHaveBeenCalledWith({ hotelId: 'valid-id' });
    expect(result).toEqual([
      {
        _id: '123',
        name: 'Test Room',
        pricePerNight: 100,
        images: ['https://example.com/image1.jpg'],
        id: '123',
        imageURL: ['https://example.com/image1.jpg'],
      },
    ]);
  });

  it('returns rooms with empty imageURL if images not present', async () => {
    (RoomModel.find as jest.Mock).mockResolvedValueOnce([mockRoomNoImages]);

    const result = await getRooms!({}, { hotelId: 'no-images-id' }, mockContext, mockInfo);

    expect(result).toEqual([
      {
        _id: '124',
        name: 'Room Without Images',
        pricePerNight: 80,
        id: '124',
        imageURL: [],
      },
    ]);
  });

  it('throws GraphQLError when no rooms found', async () => {
    (RoomModel.find as jest.Mock).mockResolvedValueOnce([]);

    await expect(getRooms!({}, { hotelId: 'no-rooms-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('throws GraphQLError when hotelId is empty', async () => {
    await expect(getRooms!({}, { hotelId: '' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('throws GraphQLError when find fails', async () => {
    (RoomModel.find as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(getRooms!({}, { hotelId: 'error-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
