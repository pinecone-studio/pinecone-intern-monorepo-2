import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { createRoom } from 'src/resolvers/mutations';
import { Response, TypePerson, RoomInformation, Bathroom, Accessibility, Internet, FoodAndDrink, BedRoom, Other, Entertainment, RoomInput } from 'src/generated';

jest.mock('src/models', () => ({
  RoomModel: {
    create: jest.fn(),
  },
}));

describe('createRoom mutation', () => {
  const mockContext = {} as any;
  const mockInfo = {} as any;

  const mockRoomInput: RoomInput = {
    hotelId: 'hotel',
    name: 'Test Room',
    pricePerNight: 100,
    imageURL: ['https://example.com/image1.jpg'],
    typePerson: TypePerson.Single,
    roomInformation: [RoomInformation.Desk],
    bathroom: [Bathroom.FreeToiletries],
    accessibility: [Accessibility.WheelchairAccessible],
    internet: [Internet.FreeWifi],
    foodAndDrink: [FoodAndDrink.FreeDinner],
    bedRoom: [BedRoom.BedSheets],
    other: [Other.LaptopWorkspace],
    entertainment: [Entertainment.CableChannels],
  };

  const expectedRoomData = {
    hotelId: 'hotel',
    name: 'Test Room',
    pricePerNight: 100,
    images: ['https://example.com/image1.jpg'],
    typePerson: TypePerson.Single,
    roomInformation: [RoomInformation.Desk],
    bathroom: [Bathroom.FreeToiletries],
    accessibility: [Accessibility.WheelchairAccessible],
    internet: [Internet.FreeWifi],
    foodAndDrink: [FoodAndDrink.FreeDinner],
    bedRoom: [BedRoom.BedSheets],
    other: [Other.LaptopWorkspace],
    entertainment: [Entertainment.CableChannels],
  };

  afterEach(() => jest.clearAllMocks());

  it('should return Response.Success when room is created', async () => {
    (RoomModel.create as jest.Mock).mockResolvedValueOnce({ _id: '123', ...expectedRoomData });

    const result = await createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo);

    expect(RoomModel.create).toHaveBeenCalledWith(expectedRoomData);
    expect(result).toBe(Response.Success);
  });

  it('should throw GraphQLError when RoomModel.create fails', async () => {
    (RoomModel.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle null imageURL gracefully', async () => {
    const mockRoomInputWithNullImages: RoomInput = {
      ...mockRoomInput,
      imageURL: null as any,
    };

    const expectedRoomDataWithEmptyImages = {
      ...expectedRoomData,
      images: [],
    };

    (RoomModel.create as jest.Mock).mockResolvedValueOnce({ _id: '123', ...expectedRoomDataWithEmptyImages });

    const result = await createRoom!({}, { input: mockRoomInputWithNullImages }, mockContext, mockInfo);

    expect(RoomModel.create).toHaveBeenCalledWith(expectedRoomDataWithEmptyImages);
    expect(result).toBe(Response.Success);
  });

  it('should filter out null and undefined values from imageURL array', async () => {
    const mockRoomInputWithMixedImages: RoomInput = {
      ...mockRoomInput,
      imageURL: ['https://example.com/image1.jpg', null, undefined, 'https://example.com/image2.jpg'] as any,
    };

    const expectedRoomDataWithFilteredImages = {
      ...expectedRoomData,
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    };

    (RoomModel.create as jest.Mock).mockResolvedValueOnce({ _id: '123', ...expectedRoomDataWithFilteredImages });

    const result = await createRoom!({}, { input: mockRoomInputWithMixedImages }, mockContext, mockInfo);

    expect(RoomModel.create).toHaveBeenCalledWith(expectedRoomDataWithFilteredImages);
    expect(result).toBe(Response.Success);
  });

  it('should throw GraphQLError when RoomModel.create returns null', async () => {
    (RoomModel.create as jest.Mock).mockResolvedValueOnce(null);

    await expect(createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('should throw GraphQLError when RoomModel.create returns undefined', async () => {
    (RoomModel.create as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });
});
