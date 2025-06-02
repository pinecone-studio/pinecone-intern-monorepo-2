import { GraphQLError } from 'graphql';
import { Hotel } from '../../../../src/models/hotel';
import { updateHotel } from '../../../../src/resolvers/mutations/hotel/update-hotel';

jest.mock('../../../../src/models/hotel', () => ({
  Hotel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateHotel mutation', () => {
  const mockInput = {
    hotelName: 'Updated Hotel',
    price: 150.50,
    description: 'Updated description',
    phoneNumber: '987-654-3210',
    amenities: ['WiFi', 'Pool', 'Spa'],
    rooms: ['683542c288acac72d9b902c1'],
    hotelStar: 5,
    guestReviews: ['683542c288acac72d9b902c2'],
    bookings: ['683542c288acac72d9b902c3'],
    roomServices: ['683542c288acac72d9b902c4'],
  };

  const mockHotel = {
    _id: '683542c288acac72d9b902ce',
    ...mockInput,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return the hotel', async () => {
    (Hotel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockHotel);
    const result = await updateHotel(null, { input: mockInput, id: '683542c288acac72d9b902ce' });
    expect(result).toEqual(mockHotel);
  });

  it('should throw error if hotel not found', async () => {
    (Hotel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(updateHotel(null, { input: mockInput, id: '683542c288acac72d9b902ce' }))
      .rejects
      .toThrow(new GraphQLError('Hotel not found'));
  });

  it('should handle internal server error', async () => {
    const errorMessage = 'Database error';
    (Hotel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await expect(updateHotel(null, { input: mockInput, id: '683542c288acac72d9b902ce' }))
      .rejects
      .toThrow(new GraphQLError(`Failed to update hotel: ${errorMessage}`));
  });

  it('should handle partial updates', async () => {
    const partialInput = {
      hotelName: 'Updated Hotel Name',
      price: 200.50,
    };

    const mockPartiallyUpdatedHotel = {
      ...mockHotel,
      ...partialInput,
      updatedAt: new Date().toISOString(),
    };

    (Hotel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockPartiallyUpdatedHotel);
    const result = await updateHotel(null, { input: partialInput, id: '683542c288acac72d9b902ce' });
    expect(result).toEqual(mockPartiallyUpdatedHotel);
  });
});
