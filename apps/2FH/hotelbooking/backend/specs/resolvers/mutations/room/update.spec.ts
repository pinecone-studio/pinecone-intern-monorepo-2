import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { updateRoom } from 'src/resolvers/mutations';
import { Response, TypePerson, RoomInformation, Bathroom, Accessibility, Internet, FoodAndDrink, BedRoom, Other, Entertainment, RoomUpdateInput } from 'src/generated';

jest.mock('src/models', () => ({
  RoomModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateRoom mutation', () => {
  const mockContext = {} as any;
  const mockInfo = {} as any;

  const mockRoomInput: RoomUpdateInput = {
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

  it('should return Response.Success when room is updated', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ _id: '123', ...mockRoomInput });

    const result = await updateRoom!({}, { id: 'some-id', input: mockRoomInput }, mockContext, mockInfo);

    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith('some-id', mockRoomInput, { new: true });
    expect(result).toBe(Response.Success);
  });

  it('should throw GraphQLError when room not found', async () => {
    // findByIdAndUpdate нь null буцаах branch
    (RoomModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    await expect(updateRoom!({}, { id: 'some-id', input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('should throw GraphQLError and log error when findByIdAndUpdate fails', async () => {
    (RoomModel.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(updateRoom!({}, { id: 'some-id', input: mockRoomInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
