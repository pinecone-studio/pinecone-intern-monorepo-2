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

  afterEach(() => jest.clearAllMocks());

  it('should return Response.Success when room is created', async () => {
    (RoomModel.create as jest.Mock).mockResolvedValueOnce({ _id: '123', ...mockRoomInput });

    const result = await createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo);

    expect(RoomModel.create).toHaveBeenCalledWith(mockRoomInput);
    expect(result).toBe(Response.Success);
  });

  it('should throw GraphQLError when RoomModel.create fails', async () => {
    (RoomModel.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(createRoom!({}, { input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
