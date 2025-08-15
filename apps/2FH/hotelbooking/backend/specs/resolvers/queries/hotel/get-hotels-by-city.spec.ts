import { hotelsByCity } from '../../../../src/resolvers/queries/hotel/get-hotels-by-city';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    find: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotelsByCity', () => {
  const mockHotels = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Hotel in New York',
      city: 'New York',
      amenities: ['wifi', 'pool'],
      toObject: jest.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel in New York',
        city: 'New York',
        amenities: ['wifi', 'pool'],
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should return hotels by city successfully', async () => {
    mockHotelModel.find.mockResolvedValue(mockHotels as any);

    const result = await (hotelsByCity as any)({}, { city: 'New York' }, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({
      city: { $regex: /New York/i },
    });
    expect(result).toHaveLength(1);
    expect(result[0].city).toBe('New York');
    expect(result[0].amenities).toEqual(['WIFI', 'POOL']);
  });

  it('2. should return empty array when no hotels found', async () => {
    mockHotelModel.find.mockResolvedValue([] as any);

    const result = await (hotelsByCity as any)({}, { city: 'NonExistentCity' }, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({
      city: { $regex: /NonExistentCity/i },
    });
    expect(result).toEqual([]);
  });

  it('3. should throw error when database query fails', async () => {
    mockHotelModel.find.mockRejectedValue(new Error('Database error'));

    try {
      await (hotelsByCity as any)({}, { city: 'New York' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to fetch hotels by city');
    }
  });

  it('4. should handle unknown amenities with fallback to Wifi', async () => {
    const hotelWithUnknownAmenity = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel with Unknown Amenity',
        city: 'New York',
        amenities: ['unknown_amenity'],
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Hotel with Unknown Amenity',
          city: 'New York',
          amenities: ['unknown_amenity'],
        }),
      },
    ];

    mockHotelModel.find.mockResolvedValue(hotelWithUnknownAmenity as any);

    const result = await (hotelsByCity as any)({}, { city: 'New York' }, {}, {});

    expect(result[0].amenities).toEqual(['WIFI']); // unknown amenity falls back to Wifi
  });
});
