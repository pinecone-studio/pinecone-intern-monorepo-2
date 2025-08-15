import { hotelsByAmenity } from '../../../../src/resolvers/queries/hotel/get-hotels-by-amenity';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    find: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotelsByAmenity', () => {
  const mockHotels = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Hotel with Pool',
      amenities: ['pool', 'wifi'],
      toObject: jest.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel with Pool',
        amenities: ['pool', 'wifi'],
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should return hotels by amenity successfully', async () => {
    mockHotelModel.find.mockResolvedValue(mockHotels as any);

    const result = await (hotelsByAmenity as any)({}, { amenity: 'POOL' }, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({ amenities: 'pool' });
    expect(result).toHaveLength(1);
    expect(result[0].amenities).toEqual(['POOL', 'WIFI']);
  });

  it('2. should return empty array when no hotels found', async () => {
    mockHotelModel.find.mockResolvedValue([] as any);

    const result = await (hotelsByAmenity as any)({}, { amenity: 'GYM' }, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({ amenities: 'gym' });
    expect(result).toEqual([]);
  });

  it('3. should throw error when database query fails', async () => {
    mockHotelModel.find.mockRejectedValue(new Error('Database error'));

    try {
      await (hotelsByAmenity as any)({}, { amenity: 'POOL' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to fetch hotels by amenity');
    }
  });

  it('4. should handle unknown amenities with fallback to Wifi', async () => {
    const hotelWithUnknownAmenity = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel with Unknown Amenity',
        amenities: ['unknown_amenity'],
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'Hotel with Unknown Amenity',
          amenities: ['unknown_amenity'],
        }),
      },
    ];

    mockHotelModel.find.mockResolvedValue(hotelWithUnknownAmenity as any);

    const result = await (hotelsByAmenity as any)({}, { amenity: 'POOL' }, {}, {});

    expect(result[0].amenities).toEqual(['WIFI']); // unknown amenity falls back to Wifi
  });
});
