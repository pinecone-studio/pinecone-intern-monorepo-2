import { hotels } from '../../../../src/resolvers/queries/hotel/get-all-hotels';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    find: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotels', () => {
  const mockHotels = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Hotel 1',
      description: 'First hotel',
      images: ['image1.jpg'],
      stars: 4,
      phone: '1234567890',
      rating: 8.5,
      city: 'City 1',
      country: 'Country 1',
      location: 'Location 1',
      languages: ['English'],
      amenities: ['air_conditioning', 'wifi'],
      policies: [],
      optionalExtras: [],
      faq: [],
      toObject: jest.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Hotel 1',
        description: 'First hotel',
        images: ['image1.jpg'],
        stars: 4,
        phone: '1234567890',
        rating: 8.5,
        city: 'City 1',
        country: 'Country 1',
        location: 'Location 1',
        languages: ['English'],
        amenities: ['air_conditioning', 'wifi'],
        policies: [],
        optionalExtras: [],
        faq: [],
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should return all hotels successfully', async () => {
    mockHotelModel.find.mockResolvedValue(mockHotels as any);

    const result = await (hotels as any)({}, {}, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({});
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('507f1f77bcf86cd799439011');
    expect(result[0].amenities).toEqual(['AIR_CONDITIONING', 'WIFI']);
  });

  it('2. should return empty array when no hotels exist', async () => {
    mockHotelModel.find.mockResolvedValue([] as any);

    const result = await (hotels as any)({}, {}, {}, {});

    expect(mockHotelModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });

  it('3. should throw error when database query fails', async () => {
    mockHotelModel.find.mockRejectedValue(new Error('Database error'));

    try {
      await (hotels as any)({}, {}, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to fetch hotels');
    }
  });
});
