import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { getRoom } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  RoomModel: {
    findById: jest.fn(),
  },
}));

describe('getRoom resolver', () => {
  const mockContext = {} as any;
  const mockInfo = {} as any;

  afterEach(() => jest.clearAllMocks());

  it('returns room object when valid id is given', async () => {
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

    (RoomModel.findById as jest.Mock).mockResolvedValueOnce(mockRoom);

    const result = await getRoom!({}, { id: 'valid-id' }, mockContext, mockInfo);

    expect(RoomModel.findById).toHaveBeenCalledWith('valid-id');
    expect(result).toEqual({
      id: '123',
      imageURL: ['https://example.com/image1.jpg'],
      _id: '123',
      name: 'Test Room',
      pricePerNight: 100,
      images: ['https://example.com/image1.jpg'],
    });
  });

  it('returns empty imageURL when images is undefined', async () => {
    const mockRoom = {
      _id: '456',
      name: 'No Image Room',
      pricePerNight: 50,
      images: undefined,
      toObject: jest.fn().mockReturnValue({
        _id: '456',
        name: 'No Image Room',
        pricePerNight: 50,
        images: undefined,
      }),
    };

    (RoomModel.findById as jest.Mock).mockResolvedValueOnce(mockRoom);

    const result = await getRoom!({}, { id: 'no-image-id' }, mockContext, mockInfo);

    expect(result.imageURL).toEqual([]);
  });

  it('throws GraphQLError when room is not found', async () => {
    (RoomModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(getRoom!({}, { id: 'nonexistent-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('throws GraphQLError and logs error when findById fails', async () => {
    (RoomModel.findById as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(getRoom!({}, { id: 'error-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
