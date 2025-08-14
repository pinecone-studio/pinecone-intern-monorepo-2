import { hotelsByRating } from '../../../../src/resolvers/queries/hotel/get-hotels-by-rating';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    find: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotelsByRating', () => {
  const mockHotels = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Hotel 1',
      rating: 9.0,
      amenities: ['air_conditioning'],
      toObject: jest.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel 1',
        rating: 9.0,
        amenities: ['air_conditioning'],
      }),
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Hotel 2',
      rating: 8.5,
      amenities: ['wifi'],
      toObject: jest.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439012',
        name: 'Hotel 2',
        rating: 8.5,
        amenities: ['wifi'],
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hotels by rating successfully', async () => {
    // Mock the chained methods: find().sort()
    const mockSort = jest.fn().mockResolvedValue(mockHotels);
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    mockHotelModel.find = mockFind;

    const result = await (hotelsByRating as any)({}, { rating: 8.0 }, {}, {});

    expect(mockFind).toHaveBeenCalledWith({
      rating: { $gte: 8.0 },
    });
    expect(mockSort).toHaveBeenCalledWith({ rating: -1 });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('507f1f77bcf86cd799439011');
    expect(result[0].amenities).toEqual(['AIR_CONDITIONING']);
    expect(result[1].id).toBe('507f1f77bcf86cd799439012');
    expect(result[1].amenities).toEqual(['WIFI']);
  });

  it('should return empty array when no hotels meet rating criteria', async () => {
    const mockSort = jest.fn().mockResolvedValue([]);
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    mockHotelModel.find = mockFind;

    const result = await (hotelsByRating as any)({}, { rating: 10.0 }, {}, {});

    expect(result).toEqual([]);
  });

  it('should throw error when database query fails', async () => {
    const mockSort = jest.fn().mockRejectedValue(new Error('Database error'));
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    mockHotelModel.find = mockFind;

    try {
      await (hotelsByRating as any)({}, { rating: 8.0 }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to fetch hotels by rating');
    }
  });

  it('should handle unknown amenities with fallback to Wifi', async () => {
    const hotelWithUnknownAmenities = [
      {
        _id: '507f1f77bcf86cd799439014',
        name: 'Unknown Amenities Hotel',
        rating: 8.0,
        amenities: ['unknown_amenity', 'another_unknown', 'pool'],
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439014',
          name: 'Unknown Amenities Hotel',
          rating: 8.0,
          amenities: ['unknown_amenity', 'another_unknown', 'pool'],
        }),
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(hotelWithUnknownAmenities);
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    mockHotelModel.find = mockFind;

    const result = await (hotelsByRating as any)({}, { rating: 8.0 }, {}, {});

    expect(result[0].amenities).toEqual(['WIFI', 'WIFI', 'POOL']); // unknown amenities fallback to Wifi
  });

  it('should handle completely undefined amenity with fallback to Wifi', async () => {
    const hotelWithUndefinedAmenity = [
      {
        _id: '507f1f77bcf86cd799439015',
        name: 'Undefined Amenity Hotel',
        rating: 8.0,
        amenities: ['', null, undefined, 'pool'].filter(Boolean), // This will create ['', 'pool']
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439015',
          name: 'Undefined Amenity Hotel',
          rating: 8.0,
          amenities: ['', 'pool'],
        }),
      },
    ];

    const mockSort = jest.fn().mockResolvedValue(hotelWithUndefinedAmenity);
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    mockHotelModel.find = mockFind;

    const result = await (hotelsByRating as any)({}, { rating: 8.0 }, {}, {});

    expect(result[0].amenities).toEqual(['WIFI', 'POOL']); // empty string should fallback to Wifi
  });
});
